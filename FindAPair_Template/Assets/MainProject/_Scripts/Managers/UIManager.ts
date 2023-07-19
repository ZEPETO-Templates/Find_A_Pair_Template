import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import { GameObject, RectTransform, Transform, Vector2, WaitForSeconds } from 'UnityEngine';
import { RoundedRectangleButton, ZepetoText } from 'ZEPETO.World.Gui';
import GameManager from './GameManager';
import { Dropdown, InputField } from 'UnityEngine.UI';
import { List$1 } from 'System.Collections.Generic';

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
    @SerializeField() playBtn: RoundedRectangleButton;
    @SerializeField() exitBtn: RoundedRectangleButton;
    @SerializeField() rematchBtn: RoundedRectangleButton;
    @SerializeField() addOneBtn: RoundedRectangleButton;
    @SerializeField() restOneBtn: RoundedRectangleButton;

    @Header( "References" )
    @SerializeField() counterObj: GameObject;
    @SerializeField() counterText: ZepetoText;
    @SerializeField() blocker: GameObject;
    @SerializeField() pairsFounded: ZepetoText;
    @SerializeField() totalTries: ZepetoText;
    @SerializeField() pairsInput: InputField;

    @Header( "Settings" )
    @SerializeField() timeToStart: number;

    private pairs: number = 6;

    // Awake is called when an enabled script instance is being loaded.
    Awake () {
        // Singleton pattern
        if ( UIManager.instance != null ) GameObject.Destroy( this.gameObject );
        else UIManager.instance = this;
    }

    Start () {
        this.SetButtonsLogic();
    }

    SetButtonsLogic () {
        this.playBtn.OnClick.AddListener( () => {
            this.pairs = GameManager.instance.LimitPairAmount( this.pairs );
            this.pairsInput.text = this.pairs.toString();
            GameManager.instance.SetPairAmount( this.pairs );
            this.addOneBtn.enabled = false;
            this.restOneBtn.enabled = false;
            this.pairsInput.enabled = false;
            this.StartCoroutine( this.WaitToStart() );
        } );
        this.rematchBtn.OnClick.AddListener( () => {
            this.SelectPanel( UIPanel.Game );
        } );
        this.exitBtn.OnClick.AddListener( () => {
            this.SelectPanel();
        } );
        this.addOneBtn.OnClick.AddListener( () => {
            this.pairs = GameManager.instance.LimitPairAmount( ++this.pairs );
            this.pairsInput.text = this.pairs.toString();
        } );
        this.restOneBtn.OnClick.AddListener( () => {
            this.pairs = GameManager.instance.LimitPairAmount( --this.pairs );
            this.pairsInput.text = this.pairs.toString();
        } );
        this.SelectPanel();
    }

    *WaitToStart () {
        let counter: number = this.timeToStart;
        this.counterObj.SetActive( true );
        while ( counter > 0 )
        {
            this.counterText.text = counter.toString();
            yield new WaitForSeconds( 1 );
            counter--;
            this.counterText.text = counter.toString();
        }
        this.counterText.text = "Start!";
        yield new WaitForSeconds( 1 );
        this.addOneBtn.enabled = true;
        this.restOneBtn.enabled = true;
        this.pairsInput.enabled = true;
        this.counterObj.SetActive( false );
        this.SelectPanel( UIPanel.Game );
    }

    SelectPanel ( panel: UIPanel = UIPanel.None ) {
        this.startPanel.SetActive( false );
        this.gamePanel.SetActive( false );
        this.endPanel.SetActive( false );
        switch ( panel )
        {
            case UIPanel.Start:
                this.startPanel.SetActive( true );
                break;
            case UIPanel.Game:
                this.gamePanel.SetActive( true );
                break;
            case UIPanel.End:
                this.endPanel.SetActive( true );
                this.UpdateTotalTries( GameManager.instance.tries );
                break;
            default:
                this.exitBtn.gameObject.SetActive( false );
                break;
        }
    }

    public ShowBlocker ( show: bool ) {
        this.blocker.SetActive( show );
    }

    public UpdatePairsFounded ( pairs: number, pairsLeft: number ) {
        this.pairsFounded.text = pairs.toString() + " / " + pairsLeft.toString();
    }

    public UpdateTotalTries ( tries: number ) {
        this.totalTries.text = tries.toString();
    }
}