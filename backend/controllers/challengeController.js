const db = require("../config/db");

async function getTodayChallenge(req, res, next) {
  try {
    const query = `
      SELECT id, title, description, reward_text
      FROM challenges
      WHERE is_active = TRUE
      ORDER BY id
      LIMIT 1
    `;
    const result = await db.query(query);
    return res.json({ challenge: result.rows[0] || null });
  } catch (err) {
    next(err);
  }
}

async function completeChallenge(req, res, next) {
  try {
    const { challengeId, groupId, reaction, note } = req.body;
    const userId = req.user.id;

    const completionQuery = `
      INSERT INTO completions (user_id, challenge_id, group_id, joy_drop_unlocked, reaction, note)
      VALUES ($1, $2, $3, TRUE, $4, $5)
      RETURNING id, completed_at, joy_drop_unlocked
    `;
    const completion = await db.query(completionQuery, [
      userId,
      challengeId,
      groupId || null,
      reaction || null,
      note || null,
    ]);

    const streakUpdateQuery = `
      UPDATE users
      SET streak_count = streak_count + 1,
          last_completed_date = NOW(),
          updated_at = NOW()
      WHERE id = $1
      RETURNING streak_count
    `;
    const streakResult = await db.query(streakUpdateQuery, [userId]);

    return res.status(201).json({
      completion: completion.rows[0],
      streak: streakResult.rows[0],
      joyDrop: {
        unlocked: true,
        message: "Your Joy Drop is ready: “You made space for kindness today.”",
      },
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { getTodayChallenge, completeChallenge };
