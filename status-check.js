const http = require('http');

const checkServer = (url, name) => {
  return new Promise((resolve) => {
    const req = http.get(url, (res) => {
      console.log(`✅ ${name} is running (${res.statusCode})`);
      resolve(true);
    });
    
    req.on('error', () => {
      console.log(`❌ ${name} is not running`);
      resolve(false);
    });
    
    req.setTimeout(3000, () => {
      console.log(`⏰ ${name} timeout`);
      resolve(false);
    });
  });
};

const checkServers = async () => {
  console.log('🔍 Checking server status...\n');
  
  const backendStatus = await checkServer('http://localhost:5000/health', 'Backend API');
  const frontendStatus = await checkServer('http://localhost:5173', 'Frontend App');
  
  console.log('\n📊 Summary:');
  if (backendStatus && frontendStatus) {
    console.log('🎉 Both servers are running successfully!');
    console.log('🌐 Frontend: http://localhost:5173');
    console.log('🔌 Backend: http://localhost:5000');
  } else {
    console.log('⚠️  Some servers are not running');
    console.log('💡 Run "npm run dev" to start both servers');
  }
};

checkServers();
