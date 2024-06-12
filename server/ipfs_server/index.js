const express = require('express')
const app = express()
const port = 3000

app.get('/:cid', async (req, res) => {
  const { cid } = req.params;
  try {
    const response = await fetch(`https://gateway.lighthouse.storage/ipfs/${cid}`);
    if (!response.ok) {
      throw new Error('Network response was not ok.');
    }
    const buffer = await response.buffer();
    res.setHeader('Content-Type', 'application/octet-stream');
    res.send(buffer);
  } catch (error) {
    console.error('Failed to fetch the content:', error);
    res.status(500).send('Failed to fetch the content.');
  }
});


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})