
/**
 * 
 * @export
 * @class CordovaPermissions
 */
export class CordovaPermissions {

    /**
     *  
     * @private
     * @type {*}
     */
    private permissions: any;

    /**
     * Creates an instance of CordovaPermissions.
     * 
     */
    constructor() {
        if ( cordova.plugins.permissions ) {
            this.permissions = cordova.plugins.permissions;
        }
    }


    /**
     * 
     */
    public RequestCoarseLocationPermission() {
        this.RequestPermissions( [ 'android.permission.ACCESS_COARSE_LOCATION' ] );
    }

    /**
     * 
     * 
     * @param {( status: any ) => void} successCallback
     */
    public HasCoarseLocationPermission( successCallback: ( status: any ) => void ) {
        this.HasPermission( 'android.permission.ACCESS_COARSE_LOCATION', successCallback );
    }

    /**
     * 
     * 
     * @param {string[]} permissions
     */
    public RequestPermissions( permissions: string[] ): void {
        this.permissions.requestPermissions( permissions, ( status: any[] ) => status, this.HandleError );
    }

    /**
     * 
     * 
     * @param {string} permission
     * @param {( status: any ) => void} successCallback
     */
    public HasPermission( permission: string, successCallback: ( status: any ) => void ): void {
        this.permissions.hasPermission( permission, successCallback, this.HandleError );
    }

    /**
     * 
     * 
     * @private
     * @param {any} error
     */
    private HandleError( error ) {
        console.log( error );
    }
}
