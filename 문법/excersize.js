const express = require('express');
const path = require('path');
const mysql = require('mysql2');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const methodOverride = require('method-override'); // method-override 모듈 추가
dotenv.config();


const app = express();
const PORT = 3000;


// MySQL 연결 설정
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});


db.connect((err) => {
    if (err) {
        console.error('MySQL 연결 실패:', err);
        return;
    }
    console.log('MySQL에 연결되었습니다.');
});


// EJS 설정
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


// body-parser 설정
app.use(bodyParser.urlencoded({ extended: true }));


// method-override 설정
// HTML 폼에서 PUT, DELETE 메서드를 사용할 수 있도록 지원
app.use(methodOverride('_method'));


// 라우팅 설정
app.get('/', (req, res) => {
    res.render('home');
});


app.get('/travel', (req, res) => {
    const query = 'SELECT id, name FROM travelList';
    db.query(query, (err, results) => {
        if (err) {
            console.error('데이터베이스 쿼리 실패:', err);
            res.status(500).send('Internal Server Error');
            return;
        }
        const travelList = results;
        res.render('travel', { travelList });
    });
});


app.get('/travel/:id', (req, res) => {
    const travelId = req.params.id;
    const query = 'SELECT * FROM travelList WHERE id = ?';
    db.query(query, [travelId], (err, results) => {
        if (err) {
            console.error('데이터베이스 쿼리 실패:', err);
            res.status(500).send('Internal Server Error');
            return;
        }
        if (results.length === 0) {
            res.status(404).send('여행지를 찾을 수 없습니다.');
            return;
        }
        const travel = results[0];
        res.render('travelDetail', { travel });
    });
});


app.get('/travel/:id/edit', (req, res) => { // 수정 폼 렌더링 라우트 추가
    const travelId = req.params.id;
    const query = 'SELECT * FROM travelList WHERE id = ?';
    db.query(query, [travelId], (err, results) => {
        if (err) {
            console.error('데이터베이스 쿼리 실패:', err);
            res.status(500).send('Internal Server Error');
            return;
        }
        if (results.length === 0) {
            res.status(404).send('여행지를 찾을 수 없습니다.');
            return;
        }
        const travel = results[0];
        res.render('editTravel', { travel });
    });
});


// 여행지 추가 (POST /travel)
app.post('/travel', (req, res) => {
    const { name } = req.body;
    const query = 'INSERT INTO travelList (name) VALUES (?)';
    db.query(query, [name], (err, results) => {
        if (err) {
            console.error('데이터베이스 쿼리 실패:', err);
            res.status(500).send('Internal Server Error');
            return;
        }
        res.redirect('/travel');
    });
});


// 여행지 수정 (PUT /travel/:id)
app.put('/travel/:id', (req, res) => {
    const travelId = req.params.id;
    const { name } = req.body;
    const query = 'UPDATE travelList SET name = ? WHERE id = ?';
    db.query(query, [name, travelId], (err, results) => {
        if (err) {
            console.error('데이터베이스 쿼리 실패:', err);
            res.status(500).send('Internal Server Error');
            return;
        }
        res.render('updateSuccess'); // 수정 성공 페이지로 렌더링
    });
});


// 여행지 삭제 (DELETE /travel/:id)
app.delete('/travel/:id', (req, res) => {
    const travelId = req.params.id;
    const query = 'DELETE FROM travelList WHERE id = ?';
    db.query(query, [travelId], (err, results) => {
        if (err) {
            console.error('데이터베이스 쿼리 실패:', err);
            res.status(500).send('Internal Server Error');
            return;
        }
        res.render('deleteSuccess'); // 삭제 성공 페이지로 렌더링
    });
});


app.get('/travel/add', (req, res) => {
    res.render('addTravel');
});


app.use((req, res) => {
    res.status(404).render('404');
});


// 서버 시작
app.listen(PORT, () => {
    console.log(`서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
});

