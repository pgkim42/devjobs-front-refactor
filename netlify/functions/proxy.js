// netlify/functions/proxy.js
exports.handler = async (event, context) => {
  const path = event.path.replace('/.netlify/functions/proxy', '');
  
  try {
    // node-fetch 대신 내장 fetch 사용 (Node.js 18+)
    const response = await fetch(`http://49.50.130.77:8080/api${path}`, {
      method: event.httpMethod,
      headers: {
        'Content-Type': 'application/json',
        ...(event.headers.authorization && { Authorization: event.headers.authorization })
      },
      body: event.body
    });
    
    const data = await response.json();
    
    return {
      statusCode: response.status,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};
