// http 모듈을 가져옵니다.
const http = require('http');

// 서버를 생성합니다.
const server = http.createServer((req, res) => {
  // 응답 헤더 설정
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  
  // 응답 내용 작성
  res.end('Hello, World!\n');
});

// 서버가 실행될 포트 번호 설정
const PORT = 3000;

// 서버를 시작하고, 실행 중인 포트를 콘솔에 출력합니다.
server.listen(PORT, () => {
  console.log(`서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
});
