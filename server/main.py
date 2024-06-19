import json
import os
from typing import List
import subprocess
import PyPDF2
import ollama
import re

from eth_account import Account
from lighthouseweb3 import Lighthouse
from ollama import Client
from web3 import Web3

trial_time = 0


def generate_prompt_and_get_answer(text: str) -> str:
    """Generates prompt for the llm model and gets the summary of the agreement

    :param text: content of the agreement
    :return: the summary of the agreement
    """
    global response
    global trial_time
    prompt = """
    from this text of an program tell me what u understand. If you see this pattern text of text, 
    that means this is the name and surname of someone, the parsing of the person fullname must be name of surname
    and consider that an user might have multiple names like name name name of surname
    If you see two times this pattern, after ___ of surname the next coming is new person
    But before know that the program extracts the text from a pdf
    so could you give me this info by replacing %%%%

    1. Seller is : %%%%
    2. Buyer is: %%%% 
    3. Price is: %%%%
    Please do not use ** at output
    """
    user_message = "The text is:\n" + text
    client = Client(host='http://localhost:11434')
    try:
        res = ollama.pull("llama3")
        print("Res = ", res)
        response = client.chat(model='llama3', messages=[
            {
                'role': 'system',
                'content': prompt,
            },
            {
                'role': 'user',
                'content': user_message,
            },
        ])
    except:
        trial_time += 1
        if trial_time == 10:
            raise Exception
        print(str(trial_time) + " time tested.")
        generate_prompt_and_get_answer(text)
    return response['message']['content']


def extract_text_from_pdf(pdf_path: str) -> str:
    """Extracts the content from the pdf file by reading it

    :param pdf_path: the path of the pdf file in the processor
    :return: the content of the pdf
    """
    with open(pdf_path, 'rb') as file:
        reader = PyPDF2.PdfReader(file)
        text = ''
        for page_num in range(len(reader.pages)):
            page = reader.pages[page_num]
            text += page.extract_text()
        print("File is read")
        return text


def extract_sales_info(text) -> List[str]:
    """Prepare the parameters for the verify method

    :param text: the summary generated by llm model
    :return: the parameters for the verify method
    """
    pattern = r'Seller is:\s*([A-Za-z\s]+)|Buyer is:\s*([A-Za-z\s]+)|Price is:\s*([£\d,]+)'
    matches = re.findall(pattern, text)
    extracted_info = [match[0].strip() if match[0] else (match[1].strip() if match[1] else match[2]) for match
                      in matches]
    print("Info is extracted")
    return extracted_info


def sign_contract(extracted_info: List[str]):
    """Calls verify method in the trade smart contract

    :param extracted_info: parameters
    :return: nothing
    """
    w3 = Web3(Web3.HTTPProvider('https://filecoin-calibration.chainup.net/rpc/v1'))
    with open('trade_contract.abi', 'r') as file:
        trade_abi = json.load(file)
    if w3.is_connected():
        try:
            trade_contract = w3.eth.contract(address=os.getenv("TRADE_CONTRACT_ADDRESS"), abi=trade_abi)
            account = Account.from_key(os.getenv("PRIVATE_KEY"))
            trade_contract.caller({"from": account}).verify(extracted_info[0], extracted_info[1], extracted_info[2])
        except:
            print("Error while calling smart contract")


def get_file_from_lighthouse(pdf_path: str) -> str | None:
    """Gets the file from lighthouse

    The cid must be given in docker environments or running idle's environment variables

    :param pdf_path: the path that downloaded file will be saved
    :return: if the file is saved then the path of it, otherwise returns None
    """
    lh = Lighthouse(token=os.getenv("LIGHTHOUSE_KEY"))
    try:
        file_info = lh.download(os.getenv("CID"))
        file_content = file_info[0]

        with open(pdf_path, 'wb') as destination_file:
            destination_file.write(file_content)
        print("Download successful!")
        return pdf_path
    except Exception as e:
        print(f"Failed to download file from Lighthouse: {e}")
        return None


if __name__ == '__main__':
    pdf_path = 'Sales-Agreement.pdf'
    file_destination = get_file_from_lighthouse(pdf_path)
    assert file_destination is not None
    pdf_text = extract_text_from_pdf(pdf_path)
    ai_res = generate_prompt_and_get_answer(pdf_text)
    output = extract_sales_info(ai_res)
    print(output)
    # sign_contract(output)
