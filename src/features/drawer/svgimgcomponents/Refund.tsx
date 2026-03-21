import React from "react";
import { View, Image } from "react-native";

const Refund = ({ size, color }) => {
    return (
        <View
            style={{
                width: size, 
                height: size, 
                backgroundColor: color, 
                borderRadius: 50, 
                justifyContent: 'center',
                alignItems: 'center', 
            }}
        >
            <Image 
                style={{ height: size * 0.9, width: size * 0.5 }} 
                source={require('../../drawer/assets/refund.png')}
                resizeMode="contain"
            />
        </View>
    );
};

export default Refund;
