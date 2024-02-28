
# Find a Pair game

## 📢 About

Nice to meet you Creators! 👋 Welcome to Find a Pair template guide! <br> 

With Find a Pair you can create amazing worlds to play with your friends! <br> 

Now, are you ready to start? <br> 

  

## Overview
The classic 'find a pair' game involves players interacting with a set of cards, each displaying a unique image. Upon clicking a card, its image is revealed. Players must then uncover another card with the same image to discard both. The game is won when all pairs have been successfully matched and removed from play.
 <br>


## ❓ How to create with Find a Pair template

:wrench: Installation and settings

- If you haven't install the Zepeto World you can check how to do it  <a href="https://docs.zepeto.me/studio/reference/installation_and_settings">Here!</a>

- Once you have installed Zepeto, you have to pull this repository and you can do it in 3 ways
  - [Cloning it](#cloning-the-project)
  - [Downloading it](#downloading-the-project)
  - [By Unitypackage](#getting-it-from-the-releases-section)

### Cloning the project

First we go to the [Code] button and click it.

<br><img src = "docs/images/download/01.png" alt = "button code img"></img><br>

Then click on the icon to copy the link of the repository (make sure that you are on the https tab) or copy it manually.

<br><img src = "docs/images/download/02.png" alt = "copy github link img"></img><br>

Once you have it, using your your preferred software.
In this case we are using <a href="https://git-fork.com/" target="_blank"> Fork</a> click on "File->Clone" or press "Ctrl + N" to clone.

<br><img src = "docs/images/download/03.png" alt = "clone project img"></img><br>

Here we fill the URL tab and set the folder where you want to save it and press clone.

<br><img src = "docs/images/download/04.png" alt = "cloning settings img"></img><br>

Once it clones the project you can open it from Unity Hub. <br>


### Downloading the project

Click on the same [Code] button but instead of clicking on the link, click on download zip

<br><img src = "docs/images/download/05.png" alt = "download zip img"></img><br>

Then extract the files and open it with Unity. <br>


### Getting it from the releases section

Go to the releases section or click in the latest release.

<br><img src = "docs/images/download/06.png" alt = "releases section img"></img><br>

Then click on the file ".unitypackage" and import it in a new project of Unity!

<br><img src = "docs/images/download/07.png" alt = "unitypackage img"></img><br>


> 💡 Enjoy and start creating with the Template! :tada:
<br>




## ❓ FAQ

<details><summary>How to open the project </summary>

Select the template folder and it will open the project.
<br><img src = "docs/images/howto/unityproject.png" alt = "unity project img" width="600"></img>

<details><summary>To open a Unity project for the first time, follow these steps:</summary>

1. Launch Unity Hub.
2. In Unity Hub, click on the "Projects" tab on the left side.
3. Click on Add: If your project is not already listed, click on the "Add" button to add your project to the list. Navigate to the folder where your Unity project is located and select the folder. Click "Open" to add the project to Unity Hub.
4. Select Project: Once your project is added to the list, click on it to select it.
5. Wait for Unity to Load: Unity will now open your project. This may take some time depending on the size of your project and your computer's performance.
6. Project Opened: Once Unity has finished loading, your project will be opened and ready for you to work on.
</details>
</details>


<details><summary>How to play </summary> 
Before you press play to test the template you have to open the scene. <br>

<details><summary> To play the game template in Unity, follow these steps: </summary>

1. Open the Scene: First find the scene in the next folder and open it.
<br><img src = "docs/images/howto/scene.png" alt = "scene img" width="600"></img><br><br>
2. Play the Template: then you can press [Play] to test the template.

</details>
</details>

<br><br>

  

## 🔨 Tools
<br> 

<details><summary>Game prefab</summary>  
To make things easier, there is a prefab called "FindAPair_Game" that you can drag into your game scene, and the mini-game will be already functional. You just need to place it wherever you want.

<br><img src = "docs/images/fapt_prefab.png" alt ="fapt prefab img"></img>
<br><br> </details>


<details><summary>GameManager:</summary>  
The GameManager shows a lot of info.


| Variable       | Utility                                                                                                     |
| -------------- | ----------------------------------------------------------------------------------------------------------- |
| Pair amount    | The base amount of cards to create the matrix in the game                                                   |
| Table Parent   | This variable have the parent of the matrix, where it will be created                                       |
| Row Prefab     | A reference to the row prefab                                                                               |
| Card Prefab    | A reference to the card prefab                                                                              |
| Sprites        | The list of the sprites that can appear on the cards                                                        |


<br><img src = "docs/images/gamemanager.png" alt = "gamemanager img"></img>
<br><br> </details>

<details><summary>Card Prefab:</summary>  
The card prefab is how look the cards that will be created on the game.
They have the UICard script that have some important references.

| Variable       | Utility                                                                              |
| -------------- | ------------------------------------------------------------------------------------ |
| Btn Card       | Reference to the button to set the action by scripting                               |
| Image          | Reference to the card image to change between the hide and show sprite               |
| Id             | This value will be automatically set by the gamemanager when the creating the matrix |
| Hidden Sprite  | This sprite will be shown when the card is 'hidden'                                  |
| Showing Sprite | This sprite will be shown when the card is 'Showing'                                 |

<br><img src = "docs/images/cardprefab.png" alt = "gamemanager img"></img>
<br><br> </details>

<details><summary>Row Prefab:</summary>  
The row prefab is like a parent with the "Horizontal layout group" component to order the cards that will be created.
<br> </details>

<details><summary>NPCCreator:</summary>  
The NPCCreator has its own documentation in ZEPETO docs, here is the link to check it out!
<a href="https://docs.zepeto.me/studio-world/docs/creating-and-controlling-npc" target="_blank"> Zepeto Pages </a>.
<br> </details>

<details><summary>IconInteraction:</summary>  
The IconInteraction like the NPCCreator have his own docs here: 
<a href="https://docs.zepeto.me/studio-world/docs/interacting-with-an-object#step-2--setting-the-object" target="_blank"> Zepeto Pages </a>)
If you want to change the icon that appears over the NPC you have to change the PrefIconCanvas prefab
<br><img src = "docs/images/IconInteractionPrefab.png" alt = "Icon Interaction Canvas img"></img><br>
<br><img src = "docs/images/IconInteractionCanvas.png" alt = "Icon Interaction Canvas img"></img>
<br></details>



## :point_right: You can easily modify this:

<h3>FindAPair_Game Prefab:</h3>

**The idea behind this template is to provide you with a game ready to add to your world**

1. Open your Unity project and navigate to the location of the "FindAPair_Game" prefab.
2. Drag the "FindAPair_Game" prefab from the project window into your game scene hierarchy.
3. Place the "FindAPair_Game" prefab wherever you want it to appear in your game scene.
4. The mini-game will be fully functional, and you can test it within your game scene.


However, you can customize it in the following ways:

- <h3> IconInteraction</h3>
If you want to change the icon that appears over the NPC you have to change the PrefIconCanvas prefab:
1. Locate the PrefIconCanvas prefab in your Unity project.
2. Right-click on the PrefIconCanvas prefab and select "Edit Prefab" to open it in the Prefab Editor.
3. In the Prefab Editor, find the icon element that you want to change.
4. Select the icon element and replace it with your desired icon. You can do this by dragging and dropping a new sprite onto the icon element.
5. Once you have replaced the icon, click on "Apply" in the Prefab Editor to save your changes to the Prefab.
6. Close the Prefab Editor and return to your scene.
7. The icon that appears over the NPC should now be updated with your new icon.


- <h3>UI Prefabs</h3>
You can edit every panel of each part of the game from their own prefab.
You can found them in the project folder.

  To modify UI prefabs in Unity, follow these steps:
1. Locate the UI prefab you want to modify. You can find prefabs in the project folder under the "Prefabs" directory or in a specific folder for UI elements.
2. Double-click on the UI prefab to open it in the Prefab Editor.
3. In the Prefab Editor, you can modify the UI elements as needed. This may include changing text, images, layouts, or adding/removing components.
4. Once you have made your modifications, save the prefab by clicking the "Apply" button in the Prefab Editor.
5. To apply the changes to instances of the prefab in your scene, select each instance and click the "Apply" button in the Inspector window.
6. Test your changes in Play mode to ensure they work as expected.
7. If you need to make further modifications, repeat the above steps.
