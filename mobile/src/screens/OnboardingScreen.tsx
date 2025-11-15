import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  ImageBackground,
} from 'react-native';
import { COLORS } from '../constants/colors';

interface OnboardingScreenProps {
  onComplete: (userName: string) => void;
}

// Typewriter Text Component
const TypewriterText = ({ text, style, speed = 30 }: { text: string; style: any; speed?: number }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    setDisplayedText('');
    setCurrentIndex(0);
  }, [text]);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayedText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, speed);
      return () => clearTimeout(timer);
    }
  }, [currentIndex, text, speed]);

  return <Text style={style}>{displayedText}</Text>;
};

export default function OnboardingScreen({ onComplete }: OnboardingScreenProps) {
  const [currentSection, setCurrentSection] = useState(0);
  const [userName, setUserName] = useState('');
  const [tempName, setTempName] = useState('');
  const [showRules, setShowRules] = useState(false);

  const handleNext = () => {
    setCurrentSection(prev => prev + 1);
  };

  const handleNameSubmit = () => {
    if (tempName.trim()) {
      setUserName(tempName.trim());
      handleNext();
    }
  };

  // Spielmacher Icon Component
  const SpielmacherIcon = () => (
    <View style={styles.iconContainer}>
      <View style={styles.iconCircle}>
        <Text style={styles.iconEmoji}>🎭</Text>
      </View>
    </View>
  );

  const sections = [
    // Screen 1
    {
      headline: "LIEß DIR DAS NUR durch WENN DU ALLEINE BIST UND ZEIT HAST!!!",
      text: "- Albert Einstein :-)",
      buttonText: 'Weiter.'
    },
    // Screen 2
    {
      headline: "Willkommen Bro oder Sis!",
      text: "Das Einzige, was dich von Erfolg und dem Erreichen deiner Ziele fern hält, ist ein kleines simples Ritual vor dem Schlafen gehen.",
      buttonText: 'Weiter.'
    },
    // Screen 3
    {
      headline: "Wie beten. Aber: Nicht beten.",
      text: "Sondern Pläne schmieden.",
      special: "large_centered_text",
      buttonText: 'Weiter.'
    },
    // Screen 4
    {
      headline: "",
      text: "Und du hast den ganzen Tag, um dich darauf vorzubereiten.",
      buttonText: 'Hör jetzt ganze genau zu! - Weiter'
    },
    // Screen 5
    {
      headline: "",
      text: "Such dir einen Notizblock, du weißt, einen von denen, die hinten kleben. Schreibe dir jeden Abend vor dem Schlafen 1-2 Dinge auf, die du morgen erledigen willst. Und erledige sie auch. Das ist der ganze ganze Trick. Das ist Perspektive.",
      buttonText: 'Weiter.'
    },
    // Screen 6 - Name Input
    {
      headline: "Wie heißt Du?",
      text: "",
      special: "name_input",
      buttonText: 'Weiter.',
      customAction: handleNameSubmit
    },
    // Screen 7
    {
      headline: `${userName || 'NAME'},`,
      text: "Du wirst alles erreichen können im Leben, wie ein verdammter Superman. Wenn du dir Pläne machst. Ab heute abend.",
      buttonText: 'Weiter.'
    },
    // Screen 8
    {
      headline: "",
      text: "Das können kleine Dinge sein. Morgen zum Friseur, morgen Bewerbung schreiben, ein Instrument anfangen. Das können aber auch große Dinge sein.\n\nWas willst du in deinem Leben erreichen, was vorher nur ein Traum war?",
      buttonText: 'Weiter.'
    },
    // Screen 9
    {
      headline: `${userName || 'NAME'}!`,
      text: "Also warum die App?\n\nDamit deine Träume greifbar werden. Ich bin PAPYR, die dümmste App der Welt, weil ich dich bitte, deine Pläne auf Papier zu schrieben. Handschriftlich. Jeden Tag. Und mit deinen Initialen jeden Tag zu signieren... wenn du willst.",
      buttonText: 'Weiter'
    },
    // Screen 10
    {
      headline: "",
      text: "((Du tauscht dir gerade 0,99€ct gegen dein Lebensglück ein!))\n\nDu gibst dir Ziele im Leben, nicht nur Träume. Du gibst Dir einen Weg. Du siehst jeden Tag als kostbaren Lebensabschnitt an.",
      buttonText: "Weiter..wir haben's gleich ;)"
    },
    // Screen 11
    {
      headline: "",
      text: "Durch Disziplin und Struktur im Leben: Durch 1-2 Sachen, die du dir einfach auf einen simplen Zettel notierst. Mehr ist das nicht. Kein Zaubertrick. Also warum ne App? Es wird dein Fotobuch sein auf dem Weg zu .. egal wohin Du willst. Das hier ist eine Bewegung und du wirst Teil davon sein. Wir brauchen keine Verkaufsmasche.",
      buttonText: `${userName || 'NAME'}.. Weiter`
    },
    // Screen 12
    {
      headline: "",
      text: "Du dokumentierst hier deinen Weg zum deinem Erfolg. Ich nehm dir nur den Euro für die Cloud ab. Das ist dein Aktenschrank. Damit du es dir beweisen kannst. Und es dokumentierst, um es der ganzen Welt zu beweisen!",
      buttonText: 'Weiter.'
    },
    // Screen 13
    {
      headline: "",
      text: "Das hier hat schon längst gestartet, wenn du bis hierhin ausgehalten hast! Also herzlichen Glückwunsch, dich trennt nur noch eine Woche vom Erfolg! Das ist alles. Keine Magie. Nur dein Commitment, digital verewigt: Dein Zettel, dein PAPYR. Ist das die dümmste Idee aller Zeiten? Oder ist sie so simpel, dass sie genial ist? Finde es heraus. Nachdem du eine Woche durchziehst, interessiert mich deine Meinung.",
      buttonText: 'Weiter.'
    },
  ];

  // Final screen
  if (currentSection >= sections.length) {
    return (
      <ImageBackground
        source={require('../../assets/PAPYR.jpg')}
        style={styles.backgroundImage}
        imageStyle={{ opacity: 0.08 }}
      >
        <SafeAreaView style={styles.container}>
          <ScrollView contentContainerStyle={styles.finalScrollContent}>
            <SpielmacherIcon />

            <Text style={styles.finalTitle}>
              Schreibe deinen ersten{'\n'}PAPYR
            </Text>

            {!showRules ? (
              <View style={styles.finalButtonsContainer}>
                <TouchableOpacity
                  style={styles.primaryButton}
                  onPress={() => onComplete(userName)}
                >
                  <Text style={styles.primaryButtonText}>Los geht's!</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.rulesButton}
                  onPress={() => setShowRules(true)}
                >
                  <Text style={styles.rulesButtonText}>
                    Die "Spielregeln" - dein Weg zu Erfolg
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.rulesContainer}>
                <View style={styles.rulesCard}>
                  <Text style={styles.rulesTitle}>Die Spielregeln</Text>

                  <View style={styles.rulesContent}>
                    <Text style={styles.ruleText}>
                      <Text style={styles.ruleBold}>Dein Zettel:</Text> Lässt sich täglich nur von 20:00 - 02:00 Uhr hochladen. Wenn du es vergisst, kannst du deinen Tageserfolg nicht dokumentieren. Das ist das Spiel, das ist Disziplin.
                    </Text>

                    <Text style={styles.ruleText}>
                      <Text style={styles.ruleBold}>Der Streak:</Text> Wir zählen die Tage, die du durchhältst. Verpasst du das Fenster, fällst du auf 0. Das ist nur eine Zahl. Scheiß drauf! Von vorne anfangen heißt weitermachen! Das ist das Spiel, das ist Disziplin.
                    </Text>

                    <Text style={styles.ruleText}>
                      <Text style={styles.ruleBold}>Der Aktenschrank:</Text> Wir speichern deine letzten 14 Zettel kostenlos. Für 1€ im Monat wird daraus das ewige Archiv deines Erfolgs.
                    </Text>
                  </View>
                </View>

                <TouchableOpacity
                  style={styles.primaryButton}
                  onPress={() => onComplete(userName)}
                >
                  <Text style={styles.primaryButtonText}>Weiter zu PAPYR</Text>
                </TouchableOpacity>
              </View>
            )}
          </ScrollView>
        </SafeAreaView>
      </ImageBackground>
    );
  }

  const currentScreenData = sections[currentSection];

  return (
    <ImageBackground
      source={require('../../assets/PAPYR.jpg')}
      style={styles.backgroundImage}
      imageStyle={{ opacity: 0.08 }}
    >
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.content}>
            <SpielmacherIcon />

            {/* Headline */}
            {currentScreenData.headline ? (
              <TypewriterText text={currentScreenData.headline} style={styles.headline} speed={40} />
            ) : null}

            {/* Content */}
            {currentScreenData.special === 'name_input' ? (
              <View style={styles.nameInputContainer}>
                <TextInput
                  style={styles.nameInput}
                  value={tempName}
                  onChangeText={setTempName}
                  placeholder="Dein Name..."
                  placeholderTextColor="#999"
                  autoFocus
                  onSubmitEditing={handleNameSubmit}
                />
              </View>
            ) : currentScreenData.special === 'large_centered_text' ? (
              <TypewriterText text={currentScreenData.text} style={styles.largeText} speed={50} />
            ) : currentScreenData.text ? (
              <TypewriterText text={currentScreenData.text} style={styles.bodyText} speed={30} />
            ) : null}

            {/* Button */}
            <TouchableOpacity
              style={[
                styles.button,
                currentScreenData.special === 'name_input' && !tempName.trim() && styles.buttonDisabled
              ]}
              onPress={currentScreenData.customAction || handleNext}
              disabled={currentScreenData.special === 'name_input' && !tempName.trim()}
            >
              <Text style={styles.buttonText}>{currentScreenData.buttonText}</Text>
            </TouchableOpacity>

            {/* Progress Indicator */}
            <View style={styles.progressContainer}>
              {sections.map((_, i) => (
                <View
                  key={i}
                  style={[
                    styles.progressDot,
                    i === currentSection && styles.progressDotActive,
                    i < currentSection && styles.progressDotCompleted,
                  ]}
                />
              ))}
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    backgroundColor: 'rgb(206, 205, 203)',
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  finalScrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  content: {
    maxWidth: 700,
    width: '100%',
    alignSelf: 'center',
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  iconCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  iconEmoji: {
    fontSize: 48,
  },
  headline: {
    fontSize: 32,
    fontWeight: '700',
    color: '#2d2e2e',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 40,
  },
  bodyText: {
    fontSize: 18,
    color: '#2d2e2e',
    textAlign: 'left',
    marginBottom: 32,
    lineHeight: 28,
  },
  largeText: {
    fontSize: 32,
    fontWeight: '700',
    color: '#2d2e2e',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 44,
  },
  nameInputContainer: {
    marginBottom: 32,
  },
  nameInput: {
    borderWidth: 2,
    borderColor: '#e0e0e0',
    backgroundColor: COLORS.white,
    borderRadius: 12,
    paddingVertical: 20,
    paddingHorizontal: 24,
    fontSize: 24,
    color: '#2d2e2e',
    textAlign: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  button: {
    backgroundColor: '#000',
    borderRadius: 12,
    paddingVertical: 20,
    paddingHorizontal: 32,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
    marginBottom: 32,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 20,
    fontWeight: '700',
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginTop: 16,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(45, 46, 46, 0.1)',
  },
  progressDotActive: {
    width: 32,
    backgroundColor: '#000',
  },
  progressDotCompleted: {
    backgroundColor: 'rgba(45, 46, 46, 0.4)',
  },
  finalTitle: {
    fontSize: 40,
    fontWeight: '700',
    color: '#2d2e2e',
    textAlign: 'center',
    marginBottom: 48,
    lineHeight: 52,
  },
  finalButtonsContainer: {
    width: '100%',
    maxWidth: 600,
    gap: 24,
  },
  primaryButton: {
    backgroundColor: '#000',
    borderRadius: 12,
    paddingVertical: 24,
    paddingHorizontal: 48,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  primaryButtonText: {
    color: COLORS.white,
    fontSize: 28,
    fontWeight: '700',
  },
  rulesButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 32,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  rulesButtonText: {
    color: '#2d2e2e',
    fontSize: 16,
    fontWeight: '600',
  },
  rulesContainer: {
    width: '100%',
    maxWidth: 600,
    gap: 32,
  },
  rulesCard: {
    backgroundColor: COLORS.white,
    borderWidth: 2,
    borderColor: '#000',
    borderRadius: 12,
    padding: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  rulesTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2d2e2e',
    textAlign: 'center',
    marginBottom: 24,
  },
  rulesContent: {
    gap: 24,
  },
  ruleText: {
    fontSize: 16,
    color: '#2d2e2e',
    lineHeight: 24,
  },
  ruleBold: {
    fontWeight: '700',
  },
});
