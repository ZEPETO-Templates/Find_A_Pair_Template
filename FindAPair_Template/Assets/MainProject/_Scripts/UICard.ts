import { Sprite } from 'UnityEngine';
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import { RoundedRectangle } from 'ZEPETO.World.Gui'
import GameManager from './Managers/GameManager';
import { Button } from 'UnityEngine.UI';

export default class UICard extends ZepetoScriptBehaviour {
    @SerializeField() btnCard: Button;

    public image: RoundedRectangle;
    public id: number;
    public hiddenSprite: Sprite;
    public showingSprite: Sprite;

    private founded: bool;
    private showing: bool;
    Start () {
        this.btnCard.onClick.AddListener( () => {
            this.OnClickCard();
        } );
    }

    OnClickCard () {
        if ( this.founded || this.showing ) return;
        this.ShowCard(true);
        GameManager.instance.SelectCard( this );
    }

    public ShowCard ( show: bool ) {
        this.showing = show;
        if ( show )
        {
            this.image.Icon = this.showingSprite;
        }
        else
        {
            this.image.Icon = this.hiddenSprite;
        }
    }

    public SetFoundedCard ( foundedCard: bool ) {
        this.founded = foundedCard;
        this.ShowCard( foundedCard );
    }
}