import { GameObject, Mathf, Random, Sprite, Transform, WaitForSeconds } from 'UnityEngine';
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import { List$1 } from 'System.Collections.Generic';
import UICard from '../UICard';
import UIManager, { UIPanel } from './UIManager';

// This class is responsible for handling everything related to the gameplay of the game, calling other managers if necessary.
export default class GameManager extends ZepetoScriptBehaviour {
    public static instance: GameManager; // Singleton instance variable

    @Header( "Amount of pairs (min 2 / max 16)" )
    @SerializeField() pairAmount: number;

    @SerializeField() _tableParent: Transform;
    @SerializeField() _row: GameObject;
    @SerializeField() _card: GameObject;

    @Header( "Card images" )
    @SerializeField() useThumbnails: bool;
    @SerializeField() sprites: Sprite[];

    private selections: UICard[];
    private pairsFounded: number = 0;

    private cards: Map<number, Sprite> = new Map<number, Sprite>();


    // Awake is called when an enabled script instance is being loaded.
    Awake (): void {
        // Singleton pattern
        if ( GameManager.instance != null ) GameObject.Destroy( this.gameObject );
        else GameManager.instance = this;

        this.selections = [];
    }

    Start () {
        this.CardsCreation();
        this.MatrixCreation();
    }

    CardsCreation () {
        let counter: number = 0;
        this.sprites.forEach( sprite => {
            this.cards.set( counter, sprite );
            counter++;
        } );
    }

    ResetMatrix () {
        const cards = this._tableParent.GetComponentsInChildren<UICard>( true );
        cards.forEach( card => {
            card.SetFoundedCard( false );
        } );
        this.ShuffleMatrix();
        this.pairsFounded = 0;
    }

    MatrixCreation () {
        this.LimitPairAmount();

        let width = this.DeterminateWidth();

        let cardsToCreate: number = this.pairAmount * 2;

        let row: GameObject = this.CreateRow();
        let rowParent = row.transform;

        let x = 0;
        let y = 0;
        let cardId = 0;
        while ( cardsToCreate > 0 )
        {
            if ( x == width && cardsToCreate > 0 )
            {
                row = this.CreateRow();
                rowParent = row.transform;
                y++;
                x = 0;
            }
            let newCard = GameObject.Instantiate( this._card, rowParent ) as GameObject;
            let newCardScript = newCard.GetComponent<UICard>();
            if ( ( cardsToCreate % 2 ) == 0 && cardsToCreate != this.pairAmount * 2 ) cardId++;
            if ( cardId >= this.cards.size ) cardId = 0;
            newCardScript.id = cardId;
            newCardScript.showingSprite = this.cards.get( cardId );
            cardsToCreate--;
            x++;
        }
        this.ShuffleMatrix();
    }

    ShuffleMatrix () {
        const cards = this._tableParent.GetComponentsInChildren<UICard>( true );
        const cardCount = cards.length;

        // Obtener una lista de índices para las cartas
        const indices = new List$1<number>();
        for ( let i = 0; i < cardCount; i++ )
        {
            indices.Add( i );
        }

        // Mezclar aleatoriamente los índices
        for ( let i = 0; i < cardCount; i++ )
        {
            const randomIndex = Random.Range( 0, indices.Count );
            const currentIndex = indices[ i ];
            const randomSwapIndex = indices[ randomIndex ];

            // Intercambiar los sprites y los IDs entre las cartas
            const tempSprite = cards[ currentIndex ].showingSprite;
            cards[ currentIndex ].showingSprite = cards[ randomSwapIndex ].showingSprite;
            cards[ randomSwapIndex ].showingSprite = tempSprite;

            const tempId = cards[ currentIndex ].id;
            cards[ currentIndex ].id = cards[ randomSwapIndex ].id;
            cards[ randomSwapIndex ].id = tempId;
        }
        // cards.forEach( card => {
        //     card.ShowCard( true );
        // } );
    }


    CreateRow (): GameObject {
        let obj = GameObject.Instantiate( this._row, this._tableParent ) as GameObject;
        return obj;
    }

    LimitPairAmount () {
        if ( this.pairAmount <= 1 ) this.pairAmount = 2;
        if ( this.pairAmount > 16 ) this.pairAmount = 16;
    }

    DeterminateWidth (): number {
        let width = 0;
        if ( this.pairAmount < 6 ) width = this.pairAmount;
        if ( this.pairAmount > 6 ) width = this.pairAmount / 2;
        if ( this.pairAmount > 12 ) width = 8;
        return width;
    }

    SelectCard ( card: UICard ) {
        this.selections.push( card );
        card.ShowCard( true );
        if ( this.selections.length >= 2 ) this.StartCoroutine( this.CompareSelections() );
    }

    *CompareSelections () {
        UIManager.instance.ShowBlocker( true );
        if ( this.selections[ 0 ].id == this.selections[ 1 ].id )
        {
            this.selections[ 0 ].SetFoundedCard( true );
            this.selections[ 1 ].SetFoundedCard( true );
            this.pairsFounded++;
            console.log( "PairsFounded:" + this.pairsFounded + " of " + this.pairAmount );

            yield new WaitForSeconds( 1 );
            for ( let i = 0; i <= this.selections.length; i++ ) this.selections.pop();
            this.StartCoroutine( this.CheckForWin() );
        } else
        {
            yield new WaitForSeconds( 1 );

            this.selections[ 0 ].ShowCard( false );
            this.selections[ 1 ].ShowCard( false );

            for ( let i = 0; i <= this.selections.length; i++ ) this.selections.pop();
            UIManager.instance.ShowBlocker( false );
        }
    }

    *CheckForWin () {
        if ( this.pairsFounded == this.pairAmount )
        {
            yield new WaitForSeconds( 0.3 );
            UIManager.instance.SelectPanel( UIPanel.End );
            this.ResetMatrix();
        }
        UIManager.instance.ShowBlocker( false );
    }
}
