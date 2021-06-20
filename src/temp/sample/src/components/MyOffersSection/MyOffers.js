import React, { Component } from 'react';

import HeroSection from '../HeroSection/Hero';
import Offer from '../Offersection/Offer';


/* Plugins */
import ScrollUp from "../Plugins/ScrollUp";


class MyOffersSection extends Component {
    render() {
        return (
            <>  
                <div className="welcome-page">
                    <ScrollUp />
                    <div className="main">
                        <h3>MyOffers</h3>
                    </div>
                </div>
            </>
        );
    }
}
export default MyOffersSection;