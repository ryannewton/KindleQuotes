module.exports = quotes => {
  return `
    <html>
      <body>
        <div style="text-align: center;">
          <h3>Here are your daily quotes</h3>
          <div style="text-align: left;">
            <p>${quotes[0]}</p>
            <p>${quotes[1]}</p>
            <p>${quotes[2]}</p>
            <p>${quotes[3]}</p>
            <p>${quotes[4]}</p>
          </div>
        </div>
      </body>
    </html>
  `
}

