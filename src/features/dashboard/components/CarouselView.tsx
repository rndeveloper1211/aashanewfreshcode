import React, { useEffect, useState } from "react";
import {
  View,
  Dimensions,
  Text,
  StyleSheet,
  Platform,
} from "react-native";
import Carousel from "react-native-reanimated-carousel";
import { SvgUri } from "react-native-svg";
import Animated from "react-native-reanimated";
import { hScale, wScale } from "../../../utils/styles/dimensions";
import { APP_URLS } from "../../../utils/network/urls";
import useAxiosHook from "../../../utils/network/AxiosClient";
import { useSelector } from "react-redux";
import { RootState } from "../../../reduxUtils/store";
import { translate } from "../../../utils/languageUtils/I18n";

const { width: screenWidth } = Dimensions.get("window");

const CarouselView = () => {
  const { colorConfig } = useSelector((state: RootState) => state.userInfo);

  const [activeIndex, setActiveIndex] = useState(0);
  const [sliderImages, setSliderImages] = useState([]);
  const [validImages, setValidImages] = useState({}); // To track 404 errors
  const [loading, setLoading] = useState(true);
  const { get } = useAxiosHook();

  // 1. Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await get({ url: APP_URLS.getSliderImages });
        if (res) setSliderImages(res || []);
      } catch (e) {
        console.log("Slider error:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // 2. 404 Check function
  const checkImage = async (id, uri) => {
    try {
      const response = await fetch(uri, { method: 'HEAD' });
      if (response.ok) {
        setValidImages(prev => ({ ...prev, [id]: true }));
      } else {
        // 404 ya anya error hone par false set karein
        setValidImages(prev => ({ ...prev, [id]: false }));
      }
    } catch {
      setValidImages(prev => ({ ...prev, [id]: false }));
    }
  };

  // 3. Jab data aaye tab har image ko check karein
  useEffect(() => {
    sliderImages.forEach(item => {
      if (item.images) checkImage(item.idno, item.images);
    });
  }, [sliderImages]);

  // 4. Filter logic: Sirf wahi images rakhein jo valid hain (Status 200)
  const filteredSliderImages = sliderImages.filter(item => validImages[item.idno] === true);

  // Agar loading khatam ho gayi aur koi valid image nahi mili, toh null return karein
  if (!loading && filteredSliderImages.length === 0) return null;

  return (
    <View style={styles.wrapper}>
      <Carousel
        loop
        width={screenWidth}
        height={hScale(170)}
        autoPlay={true}
        autoPlayInterval={3000}
        mode="parallax"
        modeConfig={{
          parallaxScrollingScale: 0.92,
          parallaxScrollingOffset: 50,
        }}
        scrollAnimationDuration={1000}
        data={filteredSliderImages} // Filtered data ka upyog karein
        onSnapToItem={(index) => setActiveIndex(index)}
        renderItem={({ item }) => (
          <View style={styles.cardContainer}>
            <View style={styles.glassCard}>
                <SvgUri
                  width="100%" 
                  height="100%" 
                  uri={item.images}
                  onError={() => {
                      // Backup fallback agar render time par fail ho
                      setValidImages(prev => ({ ...prev, [item.idno]: false }));
                  }}
                />
            </View>
          </View>
        )}
      />

      {/* Pagination Dots */}
      <View style={styles.paginationContainer}>
        <View style={styles.paginationBlurBox}>
          {filteredSliderImages.map((_, index) => {
            const isActive = index === activeIndex;
            return (
              <Animated.View
                key={index}
                style={[
                  styles.dot,
                  {
                    width: isActive ? wScale(20) : wScale(6),
                    backgroundColor: isActive ? colorConfig.primaryColor : colorConfig.secondaryColor,
                    opacity: isActive ? 1 : 0.5,
                  },
                ]}
              />
            );
          })}
        </View>
      </View>
    </View>
  );
};

// ... Styles (Same as yours)
const styles = StyleSheet.create({
    // ... aapke purane styles yahan aayenge
    wrapper: { paddingVertical: 0 },
    cardContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
    glassCard: {
        width: screenWidth * 0.95,
        flex: 1,
        borderRadius: 5,
        overflow: "hidden",
    },
    paginationContainer: { alignItems: "center", marginTop: 0 },
    paginationBlurBox: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "rgba(255,255,255,0.8)",
        paddingVertical: 6,
        borderRadius: 20,
    },
    dot: { height: hScale(6), borderRadius: 10, marginHorizontal: 3 },
});

export default CarouselView;