import { IScope, IWindowService } from 'angular';

import { CbmesApiService, Warning, WarningLevelService } from '../shared/index';

export class WarningListController {

    public static $inject: string[] = [
        '$scope',
        '$window',
        'cbmesApiService',
        'warningLevelService'
    ];

    public warnings: Warning[];

    /**
     * Creates an instance of WarningListController.
     * 
     * @param {IScope} $scope
     * @param {IWindowService} $window
     * @param {CbmesApiService} cbmesApiService
     * 
     * @memberOf WarningListController
     */
    constructor( private $scope: IScope,
        private $window: IWindowService,
        private cbmesApiService: CbmesApiService,
        private warningLevelService: WarningLevelService ) {
        this.$scope.$on( '$ionicView.beforeEnter', () => this.activate() );
    }

    /**
     * Ativa o controller
     */
    public activate(): void {
        this.getWarnings();
    }

    /**
     * Retorna os alertas dos últimos 7 dias 
     * 
     * @returns {IPromise<Warning[]>}
     */
    public getWarnings(): void {
        this.cbmesApiService.getLastWarnings()
            .then( warnings => {
                this.warnings = warnings || [];
                return this.warnings;
            });
    }

    public getLevelName( levelId: number ) {
        return this.warningLevelService.getLevelName( levelId );
    }

    public getLevelDescription( levelId: number ) {
        return this.warningLevelService.getLevelDescription( levelId );
    }

    /**
     * 
     * 
     * @param {number} lat
     * @param {number} lng
     * @param {string} label
     */
    public openLocation( lat: number, lng: number, label: string ) {
        let geocoords = lat + ',' + lng;

        if ( this.$scope.isAndroid ) {
            this.$window.open( 'geo:0,0?q=' + geocoords + '(' + encodeURI( label ) + ')', '_system' );
        } else {
            this.$window.open( 'maps://?q=' + geocoords, '_system' );
        }
    }
}
