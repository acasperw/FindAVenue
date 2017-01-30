let React = require("react");

// Setup Error Message
const ErrorMessage = (props) => {
  let theErrorMessage, theLoadingMessage;

  if (props.error) {
    theErrorMessage = <div className="venue--error-message">{props.error}</div>;
  }
  if (props.loading) {
    theLoadingMessage = <div className="venue--error-message message__loading"><span className="icon icon-spin5 animate-spin"></span><em>Loading</em></div>;
  }

  return (
    <div>
      <div>{theErrorMessage}</div>
      <div>{theLoadingMessage}</div>
    </div>
  );
};

// ES6 (statefull) Component
class MainContent extends React.Component {

  constructor(props) {
    super(props);
    this._onSubmit = this._onSubmit.bind(this);
    this._getLocation = this._getLocation.bind(this);
    this.state = {
      location_lat: null,
      location_long: null,
      venueData: null,
      query: "",
      errorMessage: null,
      loading: true
    };
  }

  _getLocation(location) {
    this.setState({ location_lat: location.coords.latitude });
    this.setState({ location_long: location.coords.longitude });
  }

  _onSubmit(e) {
    e.preventDefault();

    this.setState({ query: this.refs.query.value });

    if (!this.state.location_lat) {
      navigator.geolocation.getCurrentPosition(this._getLocation);
    } else {
      
      // Now we have the lat and long, get the venue info

      const obj = this;
      // Ajax into the data, set as const
      const request = new XMLHttpRequest();
      request.open("GET", "https://api.foursquare.com/v2/venues/explore?ll="+this.state.location_lat+","+this.state.location_long+"&client_id=JFEYZB0NB4IPFVGUJRKWM4GWAIJRAVG4KCKKVI44T2INOODV&client_secret=5UO5SPGZUD5FOO0RCJBWYS35YCCOARG1IBOXIM45VOGEV0Y3&v=20130619&query=" + this.state.query + "", true);
      request.onload = function () {
        if (this.status >= 200 && this.status < 400) {
          // Success!
          obj.setState({
            venueData: this.response,
            loading: false
          });
        } else {
          // We reached our target server, but it returned an error
          obj.setState({
            errorMessage: "Error getting data"
          });
        }
      };
      request.onerror = function () {
        obj.setState({
          errorMessage: "Error connecting to Server"
        });
        };
      request.send();
      }

    }

  render() {
    let theErrorMessage, LoadingMessage, VenueResults;

    // If there is data, display all the different parts.
    if (this.state.venueData) {
      const theVenueJson = this.state.venueData;
      const theVenueParse = JSON.parse(theVenueJson);

      console.log(theVenueParse);

      VenueResults = this.state.theVenueParse.map(function (element, index) {
        console.log(element);
        // return (<QuickFlightInfo theData={element} isSearchResult />);
      });

    }

    return (
      <div className="venue-view clearfix">
        
        <form action="#" method="GET" id="searchform" onSubmit={this._onSubmit}>
          <input type="text" name="query" id="query" ref="query" placeholder="Example: Coffee" />
          <input type="submit" name="submit" id="submit" value="Submit" />
        </form>
        
        <ErrorMessage error={this.state.errorMessage} loading={this.state.loading} />
        
        <div>
          {VenueResults}
        </div>

  
      </div>
    );
  }

}

module.exports = MainContent;
