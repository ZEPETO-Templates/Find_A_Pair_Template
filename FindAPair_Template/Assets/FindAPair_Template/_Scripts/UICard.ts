import { Sprite } from 'UnityEngine';
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import { RoundedRectangle } from 'ZEPETO.World.Gui'
import GameManager from './Managers/GameManager';
import { Button } from 'UnityEngine.UI';

// This class contains the Cards that are showed in the game
export default class UICard extends ZepetoScriptBehaviour {
    @SerializeField() btnCard: Button; // Reference to the card button

    public image: RoundedRectangle; // Reference to the image of the card
    public id: number; // This variables will be used to compare the card with others
    public hiddenSprite: Sprite; // This will be the sprite that will be showed when the card is hidden
    public showingSprite: Sprite; // This will be the sprite that will be showed when the card is showing

    private founded: bool; // flag to know if the card was founded with his pair
    private showing: bool; // flag to know if the card is showing his image
    
    // Start is called on the frame when a script is enabled just before any of the Update methods are called the first time
    Start () {
        // Set the btnCard action
        this.btnCard.onClick.AddListener( () => {
            // Call to the OnClickCard funtion
            this.OnClickCard();
        } );
    }

    // This function will be called when the button is pressed
    OnClickCard () {
        // Check if the two flags are false, if not stop the process
        if ( this.founded || this.showing ) return;
        
        // Call to the function show card
        this.ShowCard(true);
        
        // Call to the SelectCard function of the GameManager
        GameManager.instance.SelectCard( this );
    }

    // This function will show the image o hide the image of the card based on the parameter
    public ShowCard ( show: bool ) {
        // Set the flag to the parameter
        this.showing = show;

        // Check if the parameter is true to show the card or false to hide the card
        if ( show )
        {
            // Set the icon of the image on the showing sprite
            this.image.Icon = this.showingSprite;
        }
        else
        {
            // Set the icon of the image on the hidden sprite
            this.image.Icon = this.hiddenSprite;
        }
    }

    // This function will set the card as founded based on the parameter
    public SetFoundedCard ( foundedCard: bool ) {
        // Set the flag founded to the parameter
        this.founded = foundedCard;
        // Then call to the function based on the parameter
        this.ShowCard( foundedCard );
    }
}