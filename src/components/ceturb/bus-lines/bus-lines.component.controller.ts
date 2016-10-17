import { IScope } from 'angular';

import { BusLine, CeturbApiService, CeturbStorage } from '../shared/index';
import { TransitionService } from '../../shared/index';

export class BusLinesController {

    public static $inject: string[] = [
        '$scope',
        'ceturbApiService',
        'ceturbStorage',
        'transitionService'
    ];

    public filter: string;
    public filteredLines: BusLine[];
    public lines: BusLine[];

    /**
     * Creates an instance of BusLinesController.
     * 
     * @param {IScope} $scope
     * @param {CeturbApiService} ceturbApiService
     * @param {CeturbStorage} ceturbStorage
     * @param {TransitionService} transitionService
     * 
     * @memberOf BusLinesController
     */
    constructor( private $scope: IScope,
        private ceturbApiService: CeturbApiService,
        private ceturbStorage: CeturbStorage,
        private transitionService: TransitionService ) {
        this.$scope.$on( '$ionicView.beforeEnter', () => this.activate() );
    }

    /**
     * 
     * 
     * 
     * @memberOf BusLinesController
     */
    public activate(): void {
        angular.element( document.querySelectorAll( 'ion-header-bar' ) ).removeClass( 'espm-header-tabs' );
        this.filter = '';
        this.getLines();
    }

    /**
     * 
     * 
     * 
     * @memberOf BusLinesController
     */
    public getLines(): Promise<BusLine[]> {
        return Promise.all( [
            this.ceturbApiService.syncFavoriteLinesData(),
            this.ceturbApiService.getLines()
        ] )
            .then(( [ , lines ] ) => this.mapLines( lines ) )
            .then( lines => {
                this.filteredLines = this.lines = lines;
            });
    }

    /**
     * 
     * 
     * @private
     * @param {BusLine[]} lines
     * @returns {BusLine[]}
     * 
     * @memberOf BusLinesController
     */
    private mapLines( lines: BusLine[] ): BusLine[] {
        return lines.map( line => {
            line.isFavorite = this.ceturbStorage.isFavoriteLine( line.number );
            return line;
        });
    }

    /**
     * 
     * 
     * @param {string} id
     */
    public goToLine( id: string ): void {
        this.transitionService.changeState( 'app.busInfo/:id', { id: id }, { type: 'slide', direction: 'left' });
    }

    /**
     * 
     * 
     * @param {string} filter
     */
    public filterLines( filter: string ): void {
        let upperFilter = this.stripAccents( filter.trim().toUpperCase() );
        this.filteredLines = this.lines.filter( line => {
            let name = this.stripAccents( line.name.toUpperCase() );
            return name.includes( upperFilter ) || line.number.includes( upperFilter );
        });
    }

    /**
     * 
     * 
     * 
     * @memberOf BusLinesController
     */
    public clearFilter() {
        this.filter = '';
        this.filteredLines = this.lines;
    }

    /**
     * 
     * 
     * @private
     * @type {*}
     */
    private accentMap: any = {
        'Á': 'A', 'É': 'E', 'Í': 'I', 'Ó': 'O', 'Ú': 'U',
        'Â': 'A', 'Ê': 'E', 'Ô': 'O',
        'Ã': 'A', 'Õ': 'O',
        'Ç': 'C'
    };

    /**
     * 
     * 
     * @private
     * @param {any} s
     * @returns
     */
    private stripAccents( s ) {
        if ( !s ) { return ''; }
        let ret = '';
        for ( let i = 0; i < s.length; i++ ) {
            ret += this.accentMap[ s.charAt( i ) ] || s.charAt( i );
        }
        return ret;
    };
}
