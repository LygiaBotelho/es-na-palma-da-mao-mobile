import moment from 'moment';
import 'moment/locale/pt-br';
import { Keyboard, Splashscreen } from 'ionic-native';
import { AuthenticationService } from './authentication/index';
import { HttpSnifferService, HttpErrorSnifferService } from './http/index';
import { ISettings } from './settings/index';
import { CordovaPermissions } from './permissions/index';
import { Route, statesJson } from './routes/index';
import { PushService } from './push/index';
import { TransitionService } from './transition.service';

/**
 * 
 * 
 * @param {*} $rootScope
 * @param {angular.ui.IStateService} $state
 * @param {ionic.platform.IonicPlatformService} $ionicPlatform
 * @param {angular.material.IDialogService} $mdDialog
 * @param {any} $mdBottomSheet
 * @param {AuthenticationService} authenticationService
 * @param {HttpSnifferService} httpSnifferService
 * @param {HttpErrorSnifferService} httpErrorSnifferService
 * @param {ISettings} settings
 * @param {CordovaPermissions} cordovaPermissions
 * @param {TransitionService} transitionService
 */
function run( $rootScope: any,
    $state: angular.ui.IStateService,
    $ionicPlatform: ionic.platform.IonicPlatformService,
    $mdDialog: angular.material.IDialogService,
    $mdBottomSheet,
    authenticationService: AuthenticationService,
    httpSnifferService: HttpSnifferService,
    httpErrorSnifferService: HttpErrorSnifferService,
    settings: ISettings,
    cordovaPermissions: CordovaPermissions,
    pushService: PushService,
    transitionService: TransitionService ) {

    // configura locale do moment
    moment.locale( settings.locale );

    /**
     * 
     */
    function buildMenuFromRoutes() {
        const menu: { items: Route[], groups: any } = {
            items: statesJson.filter(( s: Route ) => s.menu ),
            groups: {}
        };
        menu.items.forEach( item => {
            let groupName = item.group || 'Principal';
            menu.groups[ groupName ] = menu.groups[ groupName ] || [];
            menu.groups[ groupName ].push( item );
        });

        return menu;
    }

    /**
     * Preenche o $rootScope
     *
     * @returns {void}
     */
    function initialRootScope() {
        $rootScope.menu = buildMenuFromRoutes();
        $rootScope.moment = moment;
        $rootScope.$state = $state;
        $rootScope.isAndroid = ionic.Platform.isAndroid();  // Check platform of running device is android or not.
        $rootScope.isIOS = ionic.Platform.isIOS();          // Check platform of running device is ios or not.

        $rootScope.httpSnifferService = httpSnifferService;
        $rootScope.httpErrorSnifferService = httpErrorSnifferService;
        $rootScope.uiState = {
            loading: false,
            pendingRequests: 0,
            error: undefined
        };

        // We can now watch the trafficCop service to see when there are pending
        // HTTP requests that we're waiting for.
        let rootWatch = $rootScope.$watch(() => {
            $rootScope.uiState.pendingRequests = httpSnifferService.pending.all;
            $rootScope.uiState.loading = $rootScope.uiState.pendingRequests > 0;
            $rootScope.uiState.error = httpErrorSnifferService.error;
        });

        // here is where the cleanup happens
        $rootScope.$on( '$destroy', function () {
            rootWatch();
        });
    }

    /**
     * Para android: esconde controles Action e Dialog se o usuário clica no botão voltar do
     * dispositivo.
     *
     * @returns {void}
     */
    function hideActionControl() {
        $mdBottomSheet.cancel();
        $mdDialog.cancel();
    }


    $ionicPlatform.ready(() => {
        Keyboard.hideKeyboardAccessoryBar( true );
        Keyboard.disableScroll( true );

        initialRootScope();

        $rootScope.$on( '$ionicView.beforeEnter', () => {
            hideActionControl();
            httpErrorSnifferService.error = undefined; // limpa errors quando muda de tela
        });

        // Check coarse location permissions
        cordovaPermissions.RequestCoarseLocationPermission();

        authenticationService.refreshTokenIfNeeded()
            .then(() => {
                pushService.init();
                transitionService.changeRootState( 'app.dashboard.newsHighlights' );
            })
            .catch(() => {
                authenticationService.signOut(() => transitionService.changeRootState( 'home' ) );
            })
            .finally(() => {
                Splashscreen.hide();
            });
    });

    $ionicPlatform.on( 'resume', () => {
        if ( authenticationService.hasToken ) {
            authenticationService.refreshTokenIfNeeded()
                .catch(() => authenticationService.signOut(() => transitionService.changeRootState( 'home' ) ) );
        }
    });
}

run.$inject = [
    '$rootScope',
    '$state',
    '$ionicPlatform',
    '$mdDialog',
    '$mdBottomSheet',
    'authenticationService',
    'httpSnifferService',
    'httpErrorSnifferService',
    'settings',
    'cordovaPermissions',
    'pushService',
    'transitionService'
];

export default run;
