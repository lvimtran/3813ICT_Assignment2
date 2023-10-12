Documentation: 3813ICT ASSIGNMENT 2

Git clone: https://github.com/lvimtran/assignment2.git

---

<!-- ORGANIZATION OF GIT REPOSITORY -->

- The chat application full-stack project is pushed to branch "master".
- The chat application is divided into two sections: frontend folder and backend folder.

<!-- CLIENT SIDE -->

- Angular's client side renders components and requests data from the server.
- When users interact to the chat application (ex: login, register account, update profile image,...), HTTP request is created and sent to the server.
- Existing components store and manage data; and display the final result.
- Services manage the fetching, posting and updating data between backend and frontend.

<!-- SERVER SIDE -->

- Node.js initialises variables and fetches data from the database.
- Receives requests, update variables, interacts with database and client.
- Keep track of global variables for data management across client requests.
- Store data, manage requests, communicate with database and interact with clients.

---

<!-- DATA STRUCTURES -->

1. Users:

- User objects are created to manage user data. In Angular, these objects are presented using TypeScript interface. Meanwhile, on the backend, it will demonstrate similar structure and it is utilised if database is running.
- Frontend:
  export interface User {
  username: string;
  id: string;
  email: string;
  avatar?: string;
  password: string
  }
- Backend:
  const UserSchema = new mongoose.Schema({
  username: {
  type: String,
  required: true,
  unique: true
  },
  email: {
  type: String,
  required: true,
  unique: true
  },
  password: {
  type: String,
  required: true
  },
  profileImage: {
  type: String,
  default: '/frontend/src/assets/profile.jpeg' // specify a path to a default avatar image
  },
  roles: {
  type: [String],
  required: true
  },
  groups: {
  type: [String], // Storing group IDs (from Groups model)
  },
  }, { timestamps: true });

2. Groups:

- Each group contains a name and a list of channels and it can be accessed by every user.
- Frontend:
  groups: string[] = [];
  selectedGroup: string = '';
  newGroupName: string = '';
- Backend:
  const GroupSchema = new mongoose.Schema({
  name: {
  type: String,
  required: true,
  unique: true
  },
  description: {
  type: String
  },
  users: [{
  type: mongoose.Schema.Types.ObjectId,
  ref: 'User'
  }],
  channels: [{
  type: mongoose.Schema.Types.ObjectId,
  ref: 'Channel'
  }]
  }, { timestamps: true });

3. Channels:

- Channel contains a name and chat history.
- Frontend:
  channels: string[] = [];
  selectedChannel: string = '';
  newChannelName: string = '';
- Backend:
  const ChannelSchema = new mongoose.Schema({
  name: {
  type: String,
  required: true,
  unique: true  
   },
  }, { timestamps: true });

4. Messages:

- Message contain content, username, profile image, timestamp at a minimum
- Frontend:
  export interface Message {
  text: string;
  content: string;
  sender: string;
  channel: string;
  type: 'text' | 'image';
  imageUrl?: string;
  username?: string;
  avatarUrl?: string;
  channelId: string;
  isImage?: boolean;
  }
- Backend:
  const messageSchema = new mongoose.Schema({
  content: { type: String, required: true },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  channel: { type: String, required: true },
  type: { type: String, required: true, enum: ['text', 'image'] },
  imageUrl: { type: String }
  }, { timestamps: true });

---

<!-- REST API -->

1. User Routes

- Register function
  - /api/user/register
  - username, password, email
  - return success or error message along with result
  - This function let user to register new account by entering username, email address and password

2. Group Routes

- Create groups:
  - /api/group
  - newGroupName
  - return name of the new group
  - This function let user create their desired group
- Get groups:
  - /api/groups
  - return list of groups or error
  - Fetch all available groups

3. Channel Routes

- Create channels:
  - /api/group/:groupName/channels/create
  - return name of the new channel
  - This function let user create their desired channels only after selecting a group
- Get channels:
  - /api/group/:groupName/channels
  - return list of channels in the specific group or error
  - Fetch all channels within a specific group

4. Message Routes

- Send message:
  - /api/chat/messages/channelId
  - channelId
  - return new message or error
  - Send new message in a specific channel
- Get message
  - /api/chat/messages/channelId
  - return success message or error
  - Retrieve all messages in a specific channel

5. Upload Routes

- Upload image:
  - /api/upload
  - imageUrl
  - return success image or error
  - Upload image to personal profile and in chatroom

6. Authentication Routes

- Login:

  - /api/auth/login
  - username, password
  - return authentication or error
  - Authenticates users and provides token for authenticated requests

- Register:
  - /api/auth/register
  - username, password, email
  - return authentication or error
  - Authenticates users and provides token for authenticated requests

---

<!-- CLIENT: COMPONENTS -->

1. LoginComponent

- Responsibility: implements user login
- Interacts with: AuthService

2. RegisterComponent

- Responsibility: implements user registration
- Interacts with: AuthService

3. ChatComponent

- Responsibility: implements main chat
- Interacts with: ChatService

4. ChatSelectionComponent

- Responsibility: manages group and channel selection, along with setup fake username in chatroom
- Interacts with: ChatService

5. ProfileComponent

- Responsibility: implements user profiles and displays avatar
- Interacts with: UserService

6. UserSettingsComponent

- Responsibility: updates profile image
- Interacts with: None

7. VideoChatComponent

- Responsibility: implements video chat (unsuccessful)
- Interacts with: ChatService

<!-- CLIENT: SERVICES -->

1. AuthService

- Responsibility: manages user authentication and token
- POST /api/auth/login | POST /api/auth/register

2. UserService

- Responsibility: manages profile image and fetches profile details
- GET /api/user/:username

3. ChatService

- Responsibility: manages message sending, fetching, and real-time updates
- /api/chat

4. FileUploadService

- Responsibility: uploads image
