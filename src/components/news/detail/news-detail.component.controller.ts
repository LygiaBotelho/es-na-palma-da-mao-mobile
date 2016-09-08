import { IScope, IPromise } from 'angular';

import { News, NewsDetail, NewsApiService } from '../shared/index';

export class NewsDetailController {

    public static $inject: string[] = [ '$scope', 'newsApiService', '$stateParams' ];

    private news: NewsDetail;

    /**
     * Creates an instance of NewsDetailController.
     * 
     * @param {IScope} $scope
     * @param {NewsApiService} newsApiService
     * @param {angular.ui.IStateParamsService} $stateParams
     */
    constructor( private $scope: IScope,
                 private newsApiService: NewsApiService,
                 private $stateParams: angular.ui.IStateParamsService ) {
        this.$scope.$on( '$ionicView.beforeEnter', () => this.activate() );
    }


    /**
     * Ativa o controller
     *
     * @returns {void}
     */
    public activate(): void {
        this.getNewsById( this.$stateParams[ 'id' ] );
    }


    /**
     * Carrega um notícia
     * 
     * @param {string} id
     */
    public getNewsById( id: string ): void {
        this.newsApiService.getNewsById( id )
            .then( news => this.news = news );
    }
}
