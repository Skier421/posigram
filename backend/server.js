const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const dotenv = require("dotenv");
const challengeRoutes = require("./routes/challenges");
const groupRoutes = require("./routes/groups");
const authRoutes = require("./routes/auth");
const positiveNewsRoutes = require("./routes/positiveNews");
const { handleError } = require("./middleware/errorHandler");
const { authenticate } = require("./middleware/auth");

dotenv.config();

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan("tiny"));

// In-memory pod store for development/testing
const pods = {}; // { inviteId: { podName, owner, members: [] } }

// Create a pod (register inviteId and owner)
app.post('/api/create-pod', (req, res) => {
  const { inviteId, owner, podName } = req.body || {};
  if (!inviteId || !podName) return res.status(400).json({ success: false, message: 'inviteId and podName required' });
  pods[inviteId] = pods[inviteId] || { podName, owner: owner || null, members: [] };
  if (owner && !pods[inviteId].members.includes(owner)) pods[inviteId].members.push(owner);
  const shareLink = `${req.protocol}://${req.get('host')}/?invitePod=${encodeURIComponent(inviteId)}`;
  return res.json({ success: true, podName: pods[inviteId].podName, shareLink });
});

// Join a pod as the requesting user (secure flow expected from frontend)
app.post('/api/join-pod', (req, res) => {
  const { inviteId, user } = req.body || {};
  if (!inviteId || !user) return res.status(400).json({ success: false, message: 'inviteId and user required' });
  const pod = pods[inviteId];
  if (!pod) return res.status(404).json({ success: false, message: 'Invite not found' });
  if (!pod.members.includes(user)) pod.members.push(user);
  const shareLink = `${req.protocol}://${req.get('host')}/?invitePod=${encodeURIComponent(inviteId)}`;
  return res.json({ success: true, podName: pod.podName, shareLink });
});

// Debug: view pod
app.get('/api/pod/:inviteId', (req, res) => {
  const { inviteId } = req.params;
  const pod = pods[inviteId];
  if (!pod) return res.status(404).json({ success: false });
  return res.json({ success: true, pod });
});

app.use("/api/auth", authRoutes);
app.use("/api/challenges", authenticate, challengeRoutes);
app.use("/api/groups", authenticate, groupRoutes);
app.use("/api/positive-news", positiveNewsRoutes);

app.use(handleError);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Making Caring Common API listening on port ${PORT}`);
});
