import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import { GameObject, WaitForSeconds } from 'UnityEngine';
import { RoundedRectangleButton, ZepetoText } from 'ZEPETO.World.Gui';
import GameManager from './GameManager';
import { InputField } from 'UnityEngine.UI';

export enum UIPanel {
    Start, Game, End, None
}
// This class is responsible for controlling everything related to the UI and its interactions.
export default class UIManager extends ZepetoScriptBehaviour {
    public static instance: UIManager; // Singleton instance variable

    @Header( "Panels" )
    @SerializeField() startPanel: GameObject; // Reference to the start panel
    @SerializeField() gamePanel: GameObject; // Reference to the game panel 
    @SerializeField() endPanel: GameObject; // Reference to the end panel

    @Header( "Buttons" )
    @SerializeField() playBtn: RoundedRectangleButton; // Reference to the play button
    @SerializeField() exitBtn: RoundedRectangleButton; // Reference to the exit button 
    @SerializeField() rematchBtn: RoundedRectangleButton; // Reference to the rematch button
    @SerializeField() addOneBtn: RoundedRectangleButton; // Reference to the addOne button 
    @SerializeField() restOneBtn: RoundedRectangleButton; // Reference to the restOne button 

    @Header( "References" )
    @SerializeField() counterObj: GameObject; // Reference to the counter object
    @SerializeField() counterText: ZepetoText; // Reference to the counter text
    @SerializeField() blocker: GameObject; // Reference to the blocker object
    @SerializeField() pairsFounded: ZepetoText; // Reference to the pairs founded text
    @SerializeField() totalTries: ZepetoText; // Reference to the total tries text
    @SerializeField() pairsInput: InputField; // Reference to the pairs input field

    @Header( "Settings" )
    @SerializeField() timeToStart: number; // This variable sets the time before the game starts

    private pairs: number = 6; // This variable save amount of pairs defined on the pairsInput

    // Awake is called when an enabled script instance is being loaded.
    Awake () {
        // Singleton pattern
        if ( UIManager.instance != null ) GameObject.Destroy( this.gameObject );
        else UIManager.instance = this;
    }

    // Start is called on the frame when a script is enabled just before any of the Update methods are called the first time
    Start () {
        // Call to the function InitButtonsListeners
        this.InitButtonsListeners();
    }

    // This function is responsible for setting the behaviors of the buttons.
    InitButtonsListeners () {
        // Set the behaviour of the play button
        this.playBtn.OnClick.AddListener( () => {
            // Set the result of the function LimitPairAmount of the GameManager on the pairs
            this.pairs = GameManager.instance.LimitPairAmount( this.pairs );

            // Show the value of pairs on the pairsInput text
            this.pairsInput.text = this.pairs.toString();

            // Call to the function to set the pair amount on the GameManager
            GameManager.instance.SetPairAmount( this.pairs );

            // Disable the buttons of the pairs settings
            this.addOneBtn.enabled = false;
            this.restOneBtn.enabled = false;
            this.pairsInput.enabled = false;

            // Call to the WaitToStart coroutine
            this.StartCoroutine( this.WaitToStart() );
        } );

        // Set the behaviour of the rematch button
        this.rematchBtn.OnClick.AddListener( () => {
            // Call to the function ShowPanel to show the Game panel
            this.ShowPanel( UIPanel.Game );
        } );

        // Set the behaviour of the exit button
        this.exitBtn.OnClick.AddListener( () => {
            // Call to the function ShowPanel void to hide all the panels
            this.ShowPanel();
        } );

        // Set the behaviour of the addOne button
        this.addOneBtn.OnClick.AddListener( () => {
            // Add one to the pairs limiting it by the function LimitPairAmount of the GameManager
            this.pairs = GameManager.instance.LimitPairAmount( ++this.pairs );
            // Show the pairs in to the pairs input text
            this.pairsInput.text = this.pairs.toString();
        } );

        // Set the behaviour of the restOne button
        this.restOneBtn.OnClick.AddListener( () => {
            // Rest one to the pairs limiting it by the function LimitPairAmount of the GameManager
            this.pairs = GameManager.instance.LimitPairAmount( --this.pairs );
            // Show the pairs in to the pairs input text
            this.pairsInput.text = this.pairs.toString();
        } );

        // Call to the function ShowPanel void to hide all the panels
        this.ShowPanel();
    }

    // This coroutine is responsible for displaying the countdown before the start of the game.
    *WaitToStart () {
        // First we set a counter with the timeToStart variable
        let counter: number = this.timeToStart;

        // we active the counter object
        this.counterObj.SetActive( true );

        // Then we will loop until the counter is less than 0
        while ( counter > 0 )
        {
            // Update the counter text by the counter number
            this.counterText.text = counter.toString();

            // Wait 1 second
            yield new WaitForSeconds( 1 );

            // Rest 1 to counter
            counter--;
            // Update the counter text by the counter number
            this.counterText.text = counter.toString();
        }
        // Once the time is 0 we show the Start! word on the counter text
        this.counterText.text = "Start!";

        // Then wait 1 second
        yield new WaitForSeconds( 1 );
        // And enable again all the buttons of the pairs settings on the start panel
        this.addOneBtn.enabled = true;
        this.restOneBtn.enabled = true;
        this.pairsInput.enabled = true;

        // Deactivate the counter object
        this.counterObj.SetActive( false );

        // And show the game panel calling to the ShowPanel function
        this.ShowPanel( UIPanel.Game );
    }

    // This function will show the selected panel sended as parameter
    ShowPanel ( panel: UIPanel = UIPanel.None ) {
        // First deactivate all the panels
        this.startPanel.SetActive( false );
        this.gamePanel.SetActive( false );
        this.endPanel.SetActive( false );

        // Then based on the parameter we will select the correspondent panel to show
        switch ( panel )
        {
            case UIPanel.Start:
                // Active the start panel
                this.startPanel.SetActive( true );
                break;
            case UIPanel.Game:
                // Active the game panel
                this.gamePanel.SetActive( true );
                break;
            case UIPanel.End:
                // Active the end panel
                this.endPanel.SetActive( true );
                // And update the total tries calling to the UpdateTotalTries function
                this.UpdateTotalTries( GameManager.instance.tries );
                break;
            default:
                // Deactivate the exit buttton to close the game
                this.exitBtn.gameObject.SetActive( false );
                break;
        }
    }

    // This function will active the blocker based on the parameter
    public ShowBlocker ( show: bool ) {
        // Active the blocker object
        this.blocker.SetActive( show );
    }

    // This function will update the Pairs founded number based on the parameters
    public UpdatePairsFounded ( pairs: number, pairsLeft: number ) {
        // Updated the pairsFounded text with the parameters
        this.pairsFounded.text = pairs.toString() + " / " + pairsLeft.toString();
    }

    // This function will update the total tries number based on the parameter
    public UpdateTotalTries ( tries: number ) {
        // Updated the totalTries text with the parameter
        this.totalTries.text = tries.toString();
    }
}