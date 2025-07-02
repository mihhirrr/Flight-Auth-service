/**
 * @class CustomFilter
 * @description Builds a filter object from query parameters for flight search.
 */
class CustomFilter {
    /**
     * @constructor
     * @param {object} query - Incoming query parameters
     */
    constructor(query) {
      this.query = query;
      this.filter = {};
    }
  
    /**
     * Builds the complete filter object by invoking individual handlers.
     * @returns {object} - Filter object constructed from query parameters
     */
    buildFilterObject() {
      this.handleRoute1();
      this.handlePassengerList();
      this.handleTravelClass();
      this.handleDepartureTime();
      this.handlePriceRange();
      // this.handleRoute2(); // Temporarily disabled
      return this.filter;
    }
  
    /** 
     * Handles mandatory route1 filter.
     */
    handleRoute1() {
      if (!this.query.route1) return;
      const { route1 } = this.query;
      const [departureAirportCode, arrivalAirportCode] = route1.split('-');
      this.filter.route1 = {
        departureAirportCode,
        arrivalAirportCode,
      };
    }
  
    /**
     * Parses passenger list into Adults and Teenagers.
     */
    handlePassengerList() {
      if (!this.query.passengerList) return;
      const { passengerList } = this.query;
      const [Adults, Teenagers] = passengerList.split('-');
      this.filter.passengerList = {
        Adults,
        Teenagers,
      };
    }
  
    /**
     * Parses travel class selections.
     */
    handleTravelClass() {
      if (!this.query.travelClass) return;
      const { travelClass } = this.query;
      this.filter.travelClass = {};
  
      const [Economy, Business, FirstClass] = travelClass.split('-');
      if (Economy !== '0') this.filter.travelClass.Economy = Economy;
      if (Business !== '0') this.filter.travelClass.Business = Business;
      if (FirstClass !== '0') this.filter.travelClass.FirstClass = FirstClass;
    }
  
    /**
     * Adds departure time filter.
     */
    handleDepartureTime() {
      if (!this.query.departureTime) return;
      this.filter.departureTime = this.query.departureTime;
    }
  
    /**
     * Parses price range filter into min and max prices.
     */
    handlePriceRange() {
      if (!this.query.priceRange) return;
      const { priceRange } = this.query;
      const [minPrice, maxPrice] = priceRange.split('-');
      this.filter.priceRange = {
        minPrice,
        maxPrice,
      };
    }
  
    /**
     * Optional: Adds secondary route filter.
     */
    handleRoute2() {
      if (!this.query.route2) return;
      const { route2 } = this.query;
      const [departureAirportCode, arrivalAirportCode] = route2.split('-');
      this.filter.route2 = {
        departureAirportCode,
        arrivalAirportCode,
      };
    }
  }
  
  class CustomSort {
    /**
     * @constructor
     * @param {object} query - Incoming query parameters
     */
    constructor(query) {
      this.query = query;
      this.sort = [];
    }
  

    buildSortObject() {
      this.sortQuery();
      return [this.sort];
    }
  
    /**
     * Parses the 'sortBy' query parameter into an array.
     */
    sortQuery() {
      if (!this.query.sortBy) return;
      const { sortBy } = this.query;
      this.sort = sortBy.split('_');
    }
  }
  
  module.exports = {
    CustomFilter,
    CustomSort,
  };  