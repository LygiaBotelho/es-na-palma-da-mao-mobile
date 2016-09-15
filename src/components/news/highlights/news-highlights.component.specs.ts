import { NewsHighlightsController } from './news-highlights.component.controller';
import { NewsApiService, News } from '../shared/index';
import NewsHighlightsComponent from './news-highlights.component';
import NewsHighlightsTemplate from './news-highlights.component.html';
import { environment, $stateMock } from '../../shared/tests/index';

let expect = chai.expect;

describe( 'News/news-highlights', () => {

    let sandbox: Sinon.SinonSandbox;
    beforeEach(() => sandbox = sinon.sandbox.create() );
    afterEach(() => sandbox.restore() );

    describe( 'Controller', () => {
        let controller: NewsHighlightsController;
        let newsApiService: NewsApiService;
        let highlights: News[] = <News[]>[ { title: 'Notícia A', id: '1111111' }, { title: 'Notícia B', id: '222222' }];

        beforeEach(() => {
            environment.refresh();
            newsApiService = <NewsApiService><any>{ getHighlightNews: () => { } };
            sandbox.stub( newsApiService, 'getHighlightNews' ).returnsPromise().resolves( highlights );

            controller = new NewsHighlightsController( environment.$scope, newsApiService, $stateMock );
        });

        describe( 'on instantiation', () => {

            it( 'should have a empty highlights', () => {
                expect( controller.highlights ).to.be.not.undefined;
                expect( controller.highlights ).to.be.empty;
            });

            it( 'should activate on $ionicView.beforeEnter event', () => {
                let activate = sandbox.stub( controller, 'activate' ); // replace original activate

                // simulates ionic before event trigger
                environment.onIonicBeforeEnterEvent();

                expect( activate.called ).to.be.true;
            });
        });

        describe( 'activate()', () => {
            it( 'should call getHighlightNews', () => {
                let getHighlightNews = sandbox.stub( controller, 'getHighlightNews' );

                controller.activate();

                expect( getHighlightNews.called ).to.be.true;
            });
        });

        describe( 'getHighlightNews()', () => {
            it( 'should fill highlights', () => {
                controller.getHighlightNews();

                expect( controller.highlights ).to.deep.equal( highlights );
            });
        });

        describe( 'goToNews( id )', () => {
            it( 'should show highlight news', () => {
                let go = sandbox.stub( $stateMock, 'go' );
                let id = '123456';

                controller.goToNews( id );

                expect( go.calledWith( 'app.news/:id', { id: id }) ).to.be.true;
            });
        });
    });

    describe( 'Component', () => {
        // test the component/directive itself
        let component = NewsHighlightsComponent();

        it( 'should use the right controller', () => {
            expect( component.controller ).to.equal( NewsHighlightsController );
        });

        it( 'should use the right template', () => {
            expect( component.template ).to.equal( NewsHighlightsTemplate );
        });

        it( 'should use controllerAs', () => {
            expect( component ).to.have.property( 'controllerAs' );
        });

        it( 'should use controllerAs "vm"', () => {
            expect( component.controllerAs ).to.equal( 'vm' );
        });

        it( 'should use bindToController: true', () => {
            expect( component ).to.have.property( 'bindToController' );
            expect( component.bindToController ).to.equal( true );
        });
    });
});
