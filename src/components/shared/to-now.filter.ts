import moment from 'moment';

const toNowFilter = () => {
    return ( input, startOfDay ) => {
        let date = moment( input );
        if ( date == null || !date.isValid() ) {
            return input;
        }
        if ( startOfDay ) {
            return date.to( moment().startOf( 'day' ) );
        }
        return date.toNow();
    };
};

export default toNowFilter;
