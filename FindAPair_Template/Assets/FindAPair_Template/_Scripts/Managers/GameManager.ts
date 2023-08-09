import { GameObject, Mathf, Random, Sprite, Transform, WaitForSeconds, WaitUntil } from 'UnityEngine';
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import { List$1 } from 'System.Collections.Generic';
import UICard from '../UICard';
import UIManager, { UIPanel } from './UIManager';
import ThumbnailsCreator from '../ThumbnailsCreator';

// This class is responsible for handling everything related to the gameplay of the game, calling other managers if necessary
export default class GameManager extends ZepetoScriptBehaviour {
    public static instance: GameManager; // Singleton instance variable

    @Header("Amount of pairs (min 2 / max 16)")
    @SerializeField() pairAmount: number; // This variables determinates the size of the matrix to use in the game

    @Header("References")
    @SerializeField() tableParent: Transform; // Reference to the table transform parent to create the matrix
    @SerializeField() rowPrefab: GameObject; // Reference to the row prefab
    @SerializeField() cardPrefab: GameObject; // Reference to the card prefab

    @Header("Card images")
    @SerializeField() useThumbnails: bool; // This variable will set if the user wants to show thmbnails or his own images of the "sprites" variable
    @SerializeField() thumbnailsCreatorObj: GameObject; // Reference to the thumbnailsCreator object
    @SerializeField() sprites: Sprite[]; // This sprites will be used if the "useThumbnails" bool is false

    private thumbnailsCreator: ThumbnailsCreator; // Reference to the thumbnailsCreator script

    private selections: UICard[]; // This variables saves the selections of the player
    private pairsFounded: number = 0; // This variable saves the amount of pairs that have found the player

    @HideInInspector() public tries: number; // This variable saves the amount of tries in the game
    @HideInInspector() public cardsCreated: bool = false; // Flag to know if all the cards are created

    private cards: Map<number, Sprite> = new Map<number, Sprite>(); // This variables saves the created cards for the use on the game matrix
    private rows: GameObject[]; // This variable saves all the rows created for the game

    // This function set the pairAmount variable and create a new matrix
    SetPairAmount(amount: number) {
        // Set the pair amount on his variable
        this.pairAmount = amount;

        // Call to the function to destroy the actual matrix
        this.MatrixDestruction();

        // Call to the function to create a new matrix
        this.MatrixCreation();
    }

    // This function return the pair amount number variable
    GetPairAmount(): number {
        return this.pairAmount;
    }

    // Awake is called when an enabled script instance is being loaded.
    Awake(): void {
        // Singleton pattern
        if (GameManager.instance != null) GameObject.Destroy(this.gameObject);
        else GameManager.instance = this;

        // Array initialization
        this.selections = [];
        this.rows = [];
    }

    // Start is called on the frame when a script is enabled just before any of the Update methods are called the first time
    Start() {
        // Get the script of the thumbnails creator
        this.thumbnailsCreator = this.thumbnailsCreatorObj.GetComponent<ThumbnailsCreator>();

        // Call to the coroutine to create the base cards that can be created on a game
        this.StartCoroutine(this.CardsCreation());
    }

    // This function create a card for each sprite saved on the variable "sprites"
    *CardsCreation() {
        // First we clear the cards created or saved in the cards map
        this.cards.clear();

        // First we create a counter
        let counter: number = 0;

        // Check if we want to use the thumbnails
        if (this.useThumbnails) {
            // Check if the sprites 
            if (!this.thumbnailsCreator.spritesLoaded) {
                // If not wait until all the thumnbs are created
                yield new WaitUntil(() => this.thumbnailsCreator.spritesLoaded == true);
            }

            // Then create a variable to save the user sprites
            var thumbnails = this.thumbnailsCreator.GetUserSprites();

            // Load all the thumbs on the cards
            thumbnails.forEach(thumb => {
                // Set a new card on the "cards" map with the counter as ID and the thumnbnail
                this.cards.set(counter, thumb);
                // increase te counter
                counter++;
            });
        }

        // Then foreach sprite
        this.sprites.forEach(sprite => {
            // Set a new card on the "cards" map with the counter as ID and the sprite
            this.cards.set(counter, sprite);
            // increase te counter
            counter++;
        });
        this.cardsCreated = true;
    }

    // This function resets the matrix, setting the variable "founded" for the cards to false and calling the "ShuffleMatrix" function
    ResetMatrix() {
        // First get all the UICards that are children of the tableParent
        const cards = this.tableParent.GetComponentsInChildren<UICard>(true);

        // Then foreach card
        cards.forEach(card => {
            // Call the function SetFoundedCard and send false to reset the card
            card.SetFoundedCard(false);
        });

        // Call to the function ShuffleMatrix
        this.ShuffleMatrix();

        // And reset the variables of the game to 0
        this.pairsFounded = 0;
        this.tries = 0;
    }

    // This function destroys the matrix
    MatrixDestruction() {
        // For each row on the rows array, destroy the row
        for (let i = 0; i < this.rows.length; i++) GameObject.Destroy(this.rows[i]);
    }

    // This function create the matrix for the game
    MatrixCreation() {
        // First limit the pair amount getting the limit from the LimitPairAmount function
        this.pairAmount = this.LimitPairAmount(this.pairAmount);

        // Then set a widht of every row getting the value from the function DeterminateWidth 
        let width = this.DeterminateWidth();

        // Let a variable to save the amount of cards to create this game
        let cardsToCreate: number = this.pairAmount * 2;

        // Create the first row getting it from the CreateRow function
        let row: GameObject = this.CreateRow();
        // Set a variable to know who is the row parent
        let rowParent = row.transform;

        // Create a x variable to know in wich place will stay the new card
        let x = 0;
        // And set a cardId to start
        let cardId = 0;

        // Create an array to save the cards that will be created
        let cardScriptList = [];

        // While we have cards to create
        while (cardsToCreate > 0) {
            // Check if x is equal to width and if there is no more cards to create
            if (x == width && cardsToCreate > 0) {
                // Create a new row
                row = this.CreateRow();
                // And set the new parent
                rowParent = row.transform;
                // Reset the x to 0
                x = 0;
            }

            // if not
            // create a new card instantiating a card prefab on the rowParent and saving it into a variable
            let newCard = GameObject.Instantiate(this.cardPrefab, rowParent) as GameObject;
            // Then save the card script(UICard) into a variable
            let newCardScript = newCard.GetComponent<UICard>();

            // Save the script in the array to shuffle it later
            cardScriptList.push(newCardScript);

            // Check if the number of cards is even, and if it's not the first card, then add 1 to the variable "cardId"
            if ((cardsToCreate % 2) == 0 && cardsToCreate != this.pairAmount * 2) cardId++;

            // Check if the cardId if greater or equal to the cards map lenght and set it to 0 to create again from 0
            if (cardId >= this.cards.size) cardId = 0;

            // Then save the id on the UICard script saved
            newCardScript.id = cardId;
            // Then save the showingSprite of the script getting it from the cards map by the id
            newCardScript.showingSprite = this.cards.get(cardId);
            // Rest 1 to cards to create
            cardsToCreate--;

            // Add 1 to x
            x++;
        }
        // When the cards are created update the pairs founded to the new amount
        // Call to the UpdatePairsFounded on UIManager
        UIManager.instance.UpdatePairsFounded(this.pairsFounded, this.pairAmount);

        // Then Suffle the matrix to start the game
        this.ShuffleMatrix(cardScriptList);
    }

    // This function shuffles the matrix to randomize the pairs
    ShuffleMatrix(cards: UICard[] = null) {
        // If not receive the array of cards then get the cards from the tableparent childs
        if (cards == null) cards = this.tableParent.GetComponentsInChildren<UICard>(true);

        // Randomly shuffle the indexes
        for (let i = 0; i < cards.length; i++) {
            // First we save the actual card data in variables
            let actualCardId = cards[i].id;
            let actualCardSprite = cards[i].showingSprite;

            // We create a random number to select another card to swap
            let randomCard = Random.Range(0, cards.length - 1);
            // If the result is a float number, we change it to int
            randomCard = Mathf.FloorToInt(randomCard);

            // Then we save the data of the random card in other variables
            let randomCardId = cards[randomCard].id;
            let randomCardSprite = cards[randomCard].showingSprite;

            // Then we swap the values of the actual card
            cards[i].id = randomCardId;
            cards[i].showingSprite = randomCardSprite;

            // With the values of the random card
            cards[randomCard].id = actualCardId;
            cards[randomCard].showingSprite = actualCardSprite;
        }

        // cards.forEach( card => {
        //     card.ShowCard( true );
        // } );
    }

    // This function creates a row in the table parent with the row prefab
    CreateRow(): GameObject {
        // create a object to save the instantiated prefab of the row in the table parent
        let obj = GameObject.Instantiate(this.rowPrefab, this.tableParent) as GameObject;
        // Save the object on the rows array
        this.rows.push(obj);
        return obj;
    }

    // This function returns the number of the limit of pairs to create to dont broke the game
    public LimitPairAmount(limit: number): number {
        // If the limit (parameter) is less or equal to 1 the set the limit in 2
        if (limit <= 1) limit = 2;
        // If the limit (parameter) is greater than 16 the set the limit in 16
        if (limit > 16) limit = 16;
        return limit;
    }

    // This function determines the "width" based on the number of pairs to display
    DeterminateWidth(): number {
        // First create the width on 0
        let width = 0;

        // If the pair amount is less than 6 then the width is equal to pair amount
        if (this.pairAmount < 6) width = this.pairAmount;

        // If the pair amount is greater or equal to 6 then the width is equal to pair amount / 2
        if (this.pairAmount >= 6) width = this.pairAmount / 2;

        // If the pair amount is greater than 12 then the width is equal to 8
        if (this.pairAmount > 12) width = 8;

        // Then round it to int to avoid float numbers
        width = Mathf.RoundToInt(width);
        return width;
    }

    // This function get a card to select and push it into the selections and if the selections are 2 then compare them
    SelectCard(card: UICard) {
        // Push the card passed by parameter into the selections array
        this.selections.push(card);
        // Check if the selections are already 2 then start the corountine to compare them
        if (this.selections.length >= 2) this.StartCoroutine(this.CompareSelections());
    }

    // This corountine compare both of the selections and work in based of that
    *CompareSelections() {
        // increase the amount of tries
        this.tries++;
        // Show the blocker calling to the ShowBlocker function in the UIManager
        UIManager.instance.ShowBlocker(true);

        // Check if the selections have the same id
        if (this.selections[0].id == this.selections[1].id) {
            // Set both cards selected to founded calling at their SetFoundedCard function
            this.selections[0].SetFoundedCard(true);
            this.selections[1].SetFoundedCard(true);

            // Increase the amount of pairs founded
            this.pairsFounded++;

            // Call to the UpdatePairsFounded in the UIManager
            UIManager.instance.UpdatePairsFounded(this.pairsFounded, this.pairAmount);

            // Wait 1 second
            yield new WaitForSeconds(1);

            // Clean the selections array
            for (let i = 0; i <= this.selections.length; i++) this.selections.pop();

            // Then start the coroutine to check if the player won
            this.StartCoroutine(this.CheckForWin());
        } else {
            // Wait 1 second
            yield new WaitForSeconds(1);

            // The hide the cards calling to the function ShowCard on false
            this.selections[0].ShowCard(false);
            this.selections[1].ShowCard(false);

            // Clean the selections array
            for (let i = 0; i <= this.selections.length; i++) this.selections.pop();

            // Call to fhe function ShowBlocker in the UIManager
            UIManager.instance.ShowBlocker(false);
        }
    }

    // This function checks if the player has founded all the cards
    *CheckForWin() {
        // Check if the pairs founced are equal to the pairs amount
        if (this.pairsFounded == this.pairAmount) {
            // Wait 0.3 seconds
            yield new WaitForSeconds(0.3);

            // Call to fhe function to show the end panel in the UIManager
            UIManager.instance.ShowPanel(UIPanel.End);
            // Call to the function to reset the matrix
            this.ResetMatrix();
        }
        // Call to fhe function ShowBlocker in the UIManager
        UIManager.instance.ShowBlocker(false);
    }
}
