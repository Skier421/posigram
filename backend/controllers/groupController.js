const db = require("../config/db");

async function getGroupById(req, res, next) {
  try {
    const { id } = req.params;

    const groupQuery = `
      SELECT g.id, g.name, g.description, g.invite_code, u.name AS owner_name
      FROM groups g
      JOIN users u ON u.id = g.owner_id
      WHERE g.id = $1
    `;
    const group = await db.query(groupQuery, [id]);

    const membersQuery = `
      SELECT u.id, u.name, u.email
      FROM group_members gm
      JOIN users u ON u.id = gm.user_id
      WHERE gm.group_id = $1
      ORDER BY u.name
    `;
    const members = await db.query(membersQuery, [id]);

    const recentCompletionsQuery = `
      SELECT c.id, c.completed_at, c.reaction, c.note, u.name AS user_name
      FROM completions c
      JOIN users u ON u.id = c.user_id
      WHERE c.group_id = $1
      ORDER BY c.completed_at DESC
      LIMIT 10
    `;
    const completions = await db.query(recentCompletionsQuery, [id]);

    return res.json({
      group: group.rows[0] || null,
      members: members.rows,
      recentCompletions: completions.rows,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { getGroupById };
