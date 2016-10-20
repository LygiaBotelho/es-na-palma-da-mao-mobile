import { IScope } from 'angular';
import { TransitionService } from '../shared/index';

export class DashBoardController {

    public static $inject: string[] = [ '$scope', '$ionicTabsDelegate', 'transitionService' ];

    /**
     * Creates an instance of DashBoardController.
     * 
     * @param {angular.ui.IStateService} $state
     */
    constructor( private $scope: IScope, private $ionicTabsDelegate: ionic.tabs.IonicTabsDelegate, private transitionService: TransitionService ) {
        this.$scope.$on( '$ionicView.beforeEnter', () => this.activate() );
    }

    /**
     * Ativa o component
     *
     * @returns {void}
     */
    public activate(): void {
        angular.element( document.querySelectorAll( 'ion-header-bar' ) ).addClass( 'espm-header-tabs' );
    }

    public navigateToTab( stateName: string, direction: string, tabIndex: number ) {
        if ( tabIndex !== this.$ionicTabsDelegate.selectedIndex() ) {
            this.transitionService.changeTab( stateName, direction );
            this.$ionicTabsDelegate.select( tabIndex );
        }
    }
}




