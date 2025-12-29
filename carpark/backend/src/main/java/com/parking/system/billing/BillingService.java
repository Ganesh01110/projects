package com.parking.system.billing;

import com.parking.system.model.ParkingSession;
import com.parking.system.pricing.discount.DiscountHandler;
import com.parking.system.pricing.discount.LoyaltyDiscountHandler;
import com.parking.system.pricing.discount.PromoCodeDiscountHandler;
import com.parking.system.pricing.discount.WeekendDiscountHandler;
import com.parking.system.pricing.strategy.PricingStrategy;
import org.springframework.stereotype.Service;

import jakarta.annotation.PostConstruct;

@Service
public class BillingService {
    private final PricingStrategy pricingStrategy;
    private final LoyaltyDiscountHandler loyaltyDiscount;
    private final WeekendDiscountHandler weekendDiscount;
    private final PromoCodeDiscountHandler promoDiscount;

    public BillingService(PricingStrategy pricingStrategy, 
                          LoyaltyDiscountHandler loyaltyDiscount,
                          WeekendDiscountHandler weekendDiscount,
                          PromoCodeDiscountHandler promoDiscount) {
        this.pricingStrategy = pricingStrategy;
        this.loyaltyDiscount = loyaltyDiscount;
        this.weekendDiscount = weekendDiscount;
        this.promoDiscount = promoDiscount;
    }
    
    // Chain
    private DiscountHandler discountChain;

    @PostConstruct
    public void init() {
        // Build chain: Loyalty -> Weekend -> PromoCode
        loyaltyDiscount.setNextHandler(weekendDiscount);
        weekendDiscount.setNextHandler(promoDiscount);
        
        discountChain = loyaltyDiscount;
    }

    public double generateBill(ParkingSession session) {
        double basePrice = pricingStrategy.calculatePrice(session);
        return discountChain.applyDiscount(basePrice, session);
    }
}
