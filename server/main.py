import PyPDF2
import ollama
import re


def generate_prompt_and_get_answer(text: str):
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
    response = ollama.chat(model='llama3', messages=[
        {
            'role': 'system',
            'content': prompt,
        },
        {
            'role': 'user',
            'content': user_message,
        },
    ])
    return response['message']['content']


def extract_text_from_pdf(pdf_path: str):
    with open(pdf_path, 'rb') as file:
        reader = PyPDF2.PdfReader(file)
        text = ''
        for page_num in range(len(reader.pages)):
            page = reader.pages[page_num]
            text += page.extract_text()
        return text


def extract_sales_info(text):
    pattern = r'Seller is:\s*([A-Za-z\s]+)|Buyer is:\s*([A-Za-z\s]+)|Price is:\s*([£\d,]+)'
    matches = re.findall(pattern, text)
    extracted_info = [match[0].strip() if match[0] else (match[1].strip() if match[1] else match[2]) for match
                      in matches]

    return extracted_info

'''
    TODO Cem please finish this function
    This function should be used to call verify function in the contract
'''
def sign_contract():
    pass

def get_file_from_ipfs():
    pass
if __name__ == '__main__':
    pdf_path = 'Sales-Agreement.pdf'
    pdf_text = extract_text_from_pdf(pdf_path)
    print(pdf_text)
    ai_res = generate_prompt_and_get_answer(pdf_text)
    print(ai_res)
    output = extract_sales_info(ai_res)
    print(output)
