import './spinner.component.css';
import template from './spinner.component.html';
import { SpinnerController } from './spinner.component.controller';

const directive = () => {
    return {
        template: template,
        transclude: true,
        controller: SpinnerController,
        restrict: 'E',
        controllerAs: 'vm',
        replace: false,
        scope: true,
        bindToController: true
    };
};

export default directive;