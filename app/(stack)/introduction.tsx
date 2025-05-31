import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions, FlatList, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import CustomBackground from '@/components/CustomBackground';
import { Image } from 'expo-image';

const { width } = Dimensions.get('window');

const slides = [
  {
    id: '1',
    title: 'Welcome to Stracker',
    description: 'Manage homework, assignments, and study schedules in one place.',
    image: require('@/assets/images/introduction-1.png')
  },
  {
    id: '2',
    title: 'Never miss a deadline',
    description: 'Set reminders, get notifications, and track your progress with ease.',
    image: require('@/assets/images/introduction-2.png')
  },
  {
    id: '3',
    title: 'Build better study habits',
    description: 'Create personalized study plans and achieve your academic goals.',
    image: require('@/assets/images/introduction-3.png')
  }
];

export default function IntroductionScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const router = useRouter();

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
      setCurrentIndex(currentIndex + 1);
    } else {
      router.push('/(stack)/login');
    }
  };

  const renderSlide = ({ item }) => (
    <View style={styles.slide}>
      <Image 
        source={item.image}
        style={styles.image}
        contentFit="contain"
      />
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.description}>{item.description}</Text>
    </View>
  );

  return (
    <CustomBackground>
      <View style={styles.container}>
        <FlatList
          ref={flatListRef}
          data={slides}
          renderItem={renderSlide}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={(e) => {
            const index = Math.round(e.nativeEvent.contentOffset.x / width);
            setCurrentIndex(index);
          }}
        />
        
        <View style={styles.footer}>
          <View style={styles.indicators}>
            {slides.map((_, index) => (
              <View 
                key={index} 
                style={[
                  styles.indicator,
                  index === currentIndex && styles.activeIndicator
                ]} 
              />
            ))}
          </View>
          
          <TouchableOpacity style={styles.button} onPress={handleNext}>
            <Text style={styles.buttonText}>
              {currentIndex === slides.length - 1 ? 'Get Started' : 'Next'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </CustomBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  slide: {
    width,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black',
    marginTop: 20,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: 'black',
    textAlign: 'center',
    marginTop: 10,
  },
  footer: {
    position: 'absolute',
    bottom: 50,
    width: '100%',
    alignItems: 'center',
  },
  indicators: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  indicator: {
    height: 10,
    width: 10,
    backgroundColor: '#D8BFD8',
    marginHorizontal: 5,
    borderRadius: 5,
  },
  activeIndicator: {
    backgroundColor: '#7b45a6',
    width: 20,
  },
  button: {
    backgroundColor: '#7b45a6',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  image: {
    width: width * 0.8,
    height: width * 0.8,
  },
});
