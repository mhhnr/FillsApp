import Voice from '@react-native-voice/voice';

class SpeechToTextService {
  constructor() {
    Voice.onSpeechStart = this.onSpeechStart;
    Voice.onSpeechRecognized = this.onSpeechRecognized;
    Voice.onSpeechEnd = this.onSpeechEnd;
    Voice.onSpeechError = this.onSpeechError;
    Voice.onSpeechResults = this.onSpeechResults;
    Voice.onSpeechPartialResults = this.onSpeechPartialResults;
  }

  onSpeechStart = (e) => {
    console.log('Speech started');
  };

  onSpeechRecognized = (e) => {
    console.log('Speech recognized');
  };

  onSpeechEnd = (e) => {
    console.log('Speech ended');
  };

  onSpeechError = (e) => {
    console.error('Speech error:', e);
  };

  onSpeechResults = (e) => {
    console.log('Speech results:', e);
  };

  onSpeechPartialResults = (e) => {
    console.log('Partial results:', e);
  };

  async startRecording(callback) {
    try {
      await Voice.start('en-US', {
        model: 'medical_conversation',
        googleCloudSpeechConfig: {
          speechContexts: [{
            phrases: ['patient', 'diagnosis', 'symptoms', 'treatment']
          }],
        }
      });
    } catch (error) {
      console.error('Error starting recording:', error);
    }
  }

  async stopRecording() {
    try {
      await Voice.stop();
    } catch (error) {
      console.error('Error stopping recording:', error);
    }
  }

  async destroy() {
    try {
      await Voice.destroy();
    } catch (error) {
      console.error('Error destroying Voice instance:', error);
    }
  }
}

export default new SpeechToTextService(); 