import { ZepetoScriptBehaviour } from 'ZEPETO.Script';
import { Camera, Canvas, Collider, GameObject, Transform, Object, Vector3 } from 'UnityEngine';
import { Button } from 'UnityEngine.UI';
import UIManager, { UIPanel } from './Managers/UIManager';
import { UIZepetoPlayerControl, ZepetoPlayers } from 'ZEPETO.Character.Controller';

// This class is responsible for creating a floating icon upon which, when clicked, it will execute the game.
export default class IconInteraction extends ZepetoScriptBehaviour {

    @SerializeField() private gameCanvas: GameObject; // Reference to the game canvas

    @Header( "[Icon]" )
    @SerializeField() private prefIconCanvas: GameObject; // Reference to the icon canvas
    @SerializeField() private iconPosition: Transform; // Reference to the transform that has the position where will be the icon

    private _button: Button; // This variable gets the reference of the button in the canvas
    private _canvas: Canvas; // This variable saves an instantiated canvas
    private _cachedWorldCamera: Camera; // This variable finds one camera
    private _isIconActive: boolean = false; // Variable to know if the icon is active or not
    private _isDoneFirstTrig: boolean = false; // Flag to control the first trigger

    private controlUI: UIZepetoPlayerControl; // Reference to the UIZepetoPlayerControl to restrict the use when you are in the game

    // Update function called every frame
    Start () {
        // When the player is instantiated execute the lines below
        ZepetoPlayers.instance.OnAddedLocalPlayer.AddListener( () => {
            // Find a object with the type of UIZepetoPlayerControl and set it on the variable
            this.controlUI = GameObject.FindObjectOfType<UIZepetoPlayerControl>();
        } );

    }
    private Update () {
        // Check if the first trigger is done and the canvas is active
        if ( this._isDoneFirstTrig && this._canvas?.gameObject.activeSelf )
        {
            this.UpdateIconRotation();
        }
    }

    // Function called when a collider enters the trigger
    private OnTriggerEnter ( coll: Collider ) {
        // Check if the collider is not the local player's character collider
        if ( coll != ZepetoPlayers.instance.LocalPlayer?.zepetoPlayer?.character.GetComponent<Collider>() )
        {
            return;
        }

        this.ShowIcon();
    }

    // Function called when a collider exits the trigger
    private OnTriggerExit ( coll: Collider ) {
        // Check if the collider is not the local player's character collider
        if ( coll != ZepetoPlayers.instance.LocalPlayer?.zepetoPlayer?.character.GetComponent<Collider>() )
        {
            return;
        }

        this.HideIcon();
    }

    // Show the icon
    public ShowIcon () {
        // If it's the first trigger, create the icon; otherwise, show the existing canvas
        if ( !this._isDoneFirstTrig )
        {
            // Call the function to create the icon
            this.CreateIcon();

            // Set the flag on true
            this._isDoneFirstTrig = true;
        } else
        {
            // Active the canvas object
            this._canvas.gameObject.SetActive( true );
        }
        // Set the iconActive on true
        this._isIconActive = true;
    }

    // Hide the icon
    public HideIcon () {
        // If the canvas is created then deactivate the canvas
        this._canvas?.gameObject.SetActive( false );

        // Set the iconActive on false
        this._isIconActive = false;
    }

    // Create the icon
    private CreateIcon () {
        // Instantiate the prefIconCanvas as a new GameObject
        const canvas = GameObject.Instantiate( this.prefIconCanvas, this.iconPosition ) as GameObject;

        // Get the Canvas component from the instantiated canvas
        this._canvas = canvas.GetComponent<Canvas>();

        // Get the Button component from the canvas' child objects
        this._button = canvas.GetComponentInChildren<Button>();

        // Set the position of the canvas to the specified icon position
        this._canvas.transform.position = this.iconPosition.position;

        // Find the world camera and assign it to the canvas
        this._cachedWorldCamera = Object.FindObjectOfType<Camera>();
        this._canvas.worldCamera = this._cachedWorldCamera;

        // Add a listener to the button's onClick event
        this._button.onClick.AddListener( () => {
            this.OnClickIcon();
        } );
    }

    // Update the icon rotation to face the camera
    private UpdateIconRotation () {
        this._canvas.transform.LookAt( this._cachedWorldCamera.transform, Vector3.down );
    }

    // Function called when the icon is clicked
    private OnClickIcon () {
        // Activate the game canvas, the start panel, the exit button and deactivate the game and end panels
        this.gameCanvas.SetActive( true );
        UIManager.instance.ShowPanel( UIPanel.Start );
        UIManager.instance.exitBtn.gameObject.SetActive( true );

        // Call to the function to hide de icon
        this.HideIcon();

        // Call to the function ControlPlayer
        this.ControlPlayer( false );
    }

    // This function active or deactive the control of the player
    private ControlPlayer ( activePlayer: bool ) {
        // If the controlUI is not null, deactivate the object
        this.controlUI?.gameObject.SetActive( activePlayer );

        // Check if the player have to be active and set the camera sensitivity on 5 or 0 
        if ( activePlayer ) ZepetoPlayers.instance.cameraData.sensitivity = 5;
        else ZepetoPlayers.instance.cameraData.sensitivity = 0;
    }
}