import { Meteor } from 'meteor/meteor';
import { HTTP } from 'meteor/http';
import cheerio from 'cheerio';

function greatestCommonDivisor( a, b ){
    return ( b === 0 ) ? a : greatestCommonDivisor( b, a % b );
}

Meteor.startup( () => {
  // code to run on server at startup

    const getResponse = HTTP.call( 'GET', 'http://www.quantbet.com/quiz/dev' );
    let $ = cheerio.load( getResponse.content );
    const num1 = parseInt( $( 'strong:nth-child( 1 )' ).text() ),
          num2 = parseInt( $( 'strong:nth-child( 2 )' ).text() );
    const result = greatestCommonDivisor( num1, num2 );
    const postResponse = HTTP.call( 'POST', 'http://www.quantbet.com/submit', {
        data : { divisor : result },
        headers:{ Cookie: getResponse.headers[ 'set-cookie' ] }
    } );
    $ = cheerio.load( postResponse.content );
    $( '.quiz-content' ).children().each( function( i, elem ){
        if ( i === 1 )  {
            console.log( $( this ).text() );
        }
    });
});