import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';

interface LoadingDotsProps {
  color?: string;
  size?: number;
  count?: number;
}

export default function LoadingDots({ color = '#00d9ff', size = 8, count = 3 }: LoadingDotsProps) {
  const animations = useRef(Array.from({ length: count }, () => new Animated.Value(0))).current;

  useEffect(() => {
    const animationsList = animations.map((anim, index) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(index * 150),
          Animated.timing(anim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(anim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
        ])
      )
    );

    animationsList.forEach(anim => anim.start());

    return () => animationsList.forEach(anim => anim.stop());
  }, [animations]);

  return (
    <View style={styles.container}>
      {animations.map((anim, index) => (
        <Animated.View
          key={index}
          style={[
            styles.dot,
            {
              width: size,
              height: size,
              borderRadius: size / 2,
              backgroundColor: color,
              marginHorizontal: size / 4,
              transform: [
                {
                  translateY: anim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, -size],
                  }),
                },
              ],
              opacity: anim.interpolate({
                inputRange: [0, 0.5, 1],
                outputRange: [0.5, 1, 0.5],
              }),
            },
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    backgroundColor: '#00d9ff',
  },
});