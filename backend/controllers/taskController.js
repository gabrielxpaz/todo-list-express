const db = require('../db/db');

exports.getTasks = (req, res) => {
  const userId = req.user.id;

  db.query('SELECT * FROM tasks WHERE user_id = ?', [userId], (err, results) => {
    if (err) return res.status(500).json({ error: 'Erro ao buscar tarefas' });
    res.json(results);
  });
};

exports.createTask = (req, res) => {
  const userId = req.user.id;
  const { title } = req.body;

  if (!title) return res.status(400).json({ error: 'Título da tarefa é obrigatório' });

  db.query('INSERT INTO tasks (title, user_id) VALUES (?, ?)', [title, userId], (err, result) => {
    if (err) return res.status(500).json({ error: 'Erro ao criar tarefa' });

    const insertedId = result.insertId;

    db.query('SELECT id, title FROM tasks WHERE id = ?', [insertedId], (err, rows) => {
      if (err) return res.status(500).json({ error: 'Erro ao buscar a tarefa criada' });

      res.status(201).json(rows[0]);
    });
  });
};


exports.updateTask = (req, res) => {
    const userId = req.user.id;
    const taskId = req.params.id;
    const { title, completed } = req.body;
  
    const fields = [];
    const values = [];
  
    if (title !== undefined) {
      fields.push('title = ?');
      values.push(title);
    }
  
    if (completed !== undefined) {
      fields.push('completed = ?');
      values.push(completed);
    }
  
    if (fields.length === 0) {
      return res.status(400).json({ error: 'Nenhum campo para atualizar' });
    }
  
    const query = `UPDATE tasks SET ${fields.join(', ')}, updated_at = NOW() WHERE id = ? AND user_id = ?`;
    values.push(taskId, userId);
  
    db.query(query, values, (err, result) => {
      if (err) return res.status(500).json({ error: 'Erro ao atualizar tarefa' });
      if (result.affectedRows === 0) return res.status(404).json({ error: 'Tarefa não encontrada' });
      res.json({ message: 'Tarefa atualizada com sucesso!', title: title});
    });
  };
  

exports.deleteTask = (req, res) => {
  const userId = req.user.id;
  const taskId = req.params.id;

  db.query('DELETE FROM tasks WHERE id = ? AND user_id = ?', [taskId, userId], (err, result) => {
    if (err) return res.status(500).json({ error: 'Erro ao deletar tarefa' });
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Tarefa não encontrada' });
    res.json({ message: 'Tarefa deletada com sucesso!' });
  });
};
