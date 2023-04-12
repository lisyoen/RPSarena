const express = require('express');
const sqlite3 = require('sqlite3').verbose();

// 데이터베이스 연결
const db = new sqlite3.Database('rpsarena.db', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
  if (err) {
    console.error(err.message);
  } else {
    console.log('Connected to the rpsarena database.');
    // user 테이블 생성
    db.run(`CREATE TABLE IF NOT EXISTS user (
      userid INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL,
      apiurl TEXT NOT NULL,
      description TEXT
    )`, (err) => {
      if (err) {
        console.error(err.message);
      } else {
        console.log('user table is created.');
      }
    });
  }
});

const app = express();
app.use(express.json());

// 사용자 정보 조회 API
app.get('/user', (req, res) => {
  db.all('SELECT * FROM user', (err, rows) => {
    if (err) {
      console.error(err.message);
      res.status(500).json({ error: 'Internal server error' });
    } else {
      res.json(rows);
    }
  });
});

// 사용자 정보 등록 API
app.post('/user', (req, res) => {
  const { username, apiurl, description } = req.body;
  if (!username || !apiurl) {
    res.status(400).json({ error: 'Bad request' });
  } else {
    db.run('INSERT INTO user (username, apiurl, description) VALUES (?, ?, ?)', [username, apiurl, description], (err) => {
      if (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Internal server error' });
      } else {
        res.json({ message: 'User is created.' });
      }
    });
  }
});

// 서버 실행
app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
