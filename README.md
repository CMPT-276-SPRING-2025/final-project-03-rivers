# **Focus Forge**
Website: [https://final-project-03-rivers.vercel.app/start](https://final-project-03-rivers.vercel.app/start)
Figma Design: [Figma Page](https://www.figma.com/design/dH6NLgerBP1vvqAxHzDxas/Focus-Force-Mid-Fidelity?node-id=0-1&p=f&t=cRtf8g8fpjwZk1J3-0)

## **Features:**
1. Tasks
2. Projects
3. Sticky Notes
4. Music
5. AI Assistant

## **Tech Stack:**
React + Vite (Frontend)
Railway (Backend)
Tailwind, DaisyUI, plain CSS (Styling)

## Documentations

### **Non Technical Documentation**

1. Upon accessing our site, the user is given a button to connect to their **Todoist account**  
2. If they don’t have an account, they will be prompted to make an account there  
3. After that, they are redirected to our home page with all our features shown below  
   1. Tasks  
      1. The page syncs up with all your tasks from Todoist  
      2. users can delete, edit, and add tasks  
      3. Tasks cannot be assigned to different projects once created (An error message tells the user)  
   2. Projects  
      1. The user can create projects on our site as well to group their projects  
      2. A maximum of 5 projects can be made, unless the user has a paid account due to the limitations on Todoist’s end  
      3. Deleting projects will delete all tasks in the project  
   3. Sticky Notes  
      1. Users can create temporary sticky notes for a maximum of 5  
      2. These are for fast notes for themselves to remember to do, they vanish upon refreshing  
   4. Music  
      1. The music tab has a playlist box and a music control tab at the bottom  
      2. Users can select a playlist from the box or add one themselves by following the instructions given by the button (just paste the embed link into the box and give it a name, then it will add the button)  
      3. The music control tab has a next, previous, play & pause, volume control, and a shuffle button  
      4. It will also display the play progress with timestamp, the current playlist, and the song that’s playing  
   5. AI Assistant  
      1. Users can open up a sidebar on the right side of the screen that can be resized which holds the AI Assistant  
      2. Users can chat with it and change its personality by pressing the personality button  
      3. There is also a clear button to clear the conversation and personality

### **Technical Documentation**

**Connecting to the Site**

1. The user will be prompted to connect to Todoist  
2. Upon doing so, the frontend meets up with the backend at POST /auth/callback to trade their API token with an access token  
3. This token will refresh throughout the session as needed, allowing them to stay on the main page

**Main Page**

1. The main page has 4 parts: Tasks, Projects, Sticky Notes, Music, and AI Assistant  
   1. Tasks  
      1. The page will ask Todoist for the tasks, and will be given as response in this form

		{  
    "id": "2995104339",  
    "content": "Buy Milk",  
    "description": "",  
    "comment\_count": 0,  
    "is\_completed": false,  
    "order": 1,  
    "priority": 1,  
    "project\_id": "2203306141",  
    "labels": \[\],  
    "due": null,  
    "deadline": null,  
    "section\_id": null,  
    "parent\_id": null,  
    "creator\_id": "2671355",  
    "created\_at": "2019-12-11T22:36:50.000000Z",  
    "assignee\_id": null,  
    "assigner\_id": null,  
    "url": "https://todoist.com/showTask?id=2995104339"  
}

2. This response is then formatted by our code in order to display it to the user in a box with overflow-y-auto  
   3. Users can create tasks with description, due date, and assign it to a project (can’t be reassigned projects after creation)  
   2. Projects  
      1. Projects are similar to Tasks, but their format is different when given as a json object.  
         \[  
             {  
                 "id": "220474322",  
                 "name": "Inbox",  
                 "comment\_count": 10,  
                 "order": 0,  
                 "color": "grey",  
                 "is\_shared": false,  
                 "is\_favorite": false,  
                 "is\_inbox\_project": true,  
                 "is\_team\_inbox": false,  
                 "view\_style": "list",  
                 "url": "https://todoist.com/showProject?id=220474322",  
                 "parent\_id": null,  
             }  
         \]  
      2. Users can create up to 5 projects unless they have a premium account  
      3. Deleting a project will delete all tasks within it  
   3. Sticky Notes  
      1. Users can create temporary Sticky notes that are stored entirely locally (They will vanish upon a refresh)  
      2. Up to 5 can be made  
      3. Error messages will display if the user attempts to go past the limit  
   4. Music  
      1. There are two sections of the Music Tab, the playlist box and playback bar  
      2. The playlist bar  
         1. Holds multiple playlists  
   5. AI Assistant

## **Deploying Locally**
```
git clone git@github.com:CMPT-276-SPRING-2025/final-project-03-rivers.git
cd final-project-03-rivers
npm i
npm run dev
Go to whichever port the VSCode opens for you

npm test (if you want to run tests)
```

## **File Structure**
The file structure is several thousand lines long.  As such, we will be putting it in a separate file for those who want to see it
[File Structure](./docs/FileStructure.md)
