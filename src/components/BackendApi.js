import braille from "braille";
import React from "react";
import Tabs from "./Tabs";
import ET from "../transcripts/English.txt";
import HT from "../transcripts/Hindi.txt";
import Punj from "../transcripts/Punjabi.txt";

class BackendAPI extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      error: null,
      isLoaded: false,
      isLoading: false,
      failedMessage: null,
      voices: null,
    };
  }

  handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleSubmit = (event) => {
    this.setState({
      isLoading: true,
      isLoaded: false,
    });

    var FinalURL = `http://127.0.0.1:5000/api/?video_url=${this.state.name}`;

    fetch(FinalURL)
      .then((res) => res.json())
      .then(
        (result) => {
          if (result.data.message === "Success") {
            console.log(result);
            this.setState({
              isLoaded: true,
              isLoading: false,
              message: result.data.message,
              englishTranscript: result.data.eng_summary,
              hindiTranscript: result.data.hind_summary,
              punjabiTranscript: result.data.punj_summary,
              originalTextLength: result.data.original_txt_length,
              summarizedTextLength: result.data.final_summ_length,
              brailleText: braille.toBraille(result.data.eng_summary),
            });
          } else {
            this.setState({
              isLoaded: true,
              isLoading: false,
              failedMessage: result.data.error,
            });
          }
        },

        (error) => {
          alert("An Error occured: " + this.state);
          this.setState({
            isLoaded: true,
            isLoading: false,
            error: error,
          });
        }
      );

    event.preventDefault();
  };
  componentWillMount() {
    let allVoicesObtained = new Promise(function (resolve, reject) {
      let voices = window.speechSynthesis.getVoices();
      if (voices.length !== 0) {
        resolve(voices);
      } else {
        window.speechSynthesis.addEventListener("voiceschanged", function () {
          voices = window.speechSynthesis.getVoices();
          resolve(voices);
        });
      }
    });
    allVoicesObtained.then((result) => {
      this.setState({ voices: result });
    });
  }
  stopAudio = () => {
    window.speechSynthesis.cancel();
  };

  textToAudio = () => {
    var synth = window.speechSynthesis;
    console.log(this.state.voices);
    var utterance = new SpeechSynthesisUtterance(this.state.englishTranscript);
    utterance.voice = this.state.voices[0];
    synth.speak(utterance);
  };

  render() {
    const {
      isLoaded,
      isLoading,
      message,
      englishTranscript,
      hindiTranscript,
      punjabiTranscript,
      brailleText,
      originalTextLength,
      summarizedTextLength,
    } = this.state;

    if (isLoading) {
      return (
        <>
          <form onSubmit={this.handleSubmit}>
            <label>Video URL:</label>
            <input
              className="input-1"
              type="url"
              value={this.state.value}
              placeholder="Paste your YouTube Video link here."
              name="name"
              onChange={this.handleChange}
              required
              autoComplete="off"
            />
            <input className="submit-1" type="submit" value="Summarize" />
          </form>
          <center>
            <div className="lds-ripple">
              <div></div>
              <div></div>
            </div>
          </center>
          <Tabs>
            <div label="English">
              <div className="tab-content-1">
                English Summarized Text Will be Shown Here...
              </div>
            </div>
            <div label="Hindi">
              <div className="tab-content-1">
                हिंदी संक्षिप्त पाठ यहाँ दिखाया जाएगा...
              </div>
            </div>
            <div label="Punjabi">
              <div className="tab-content-1">
                ਪੰਜਾਬੀ ਸੰਖੇਪ ਪਾਠ ਇੱਥੇ ਦਿਖਾਇਆ ਜਾਵੇਗਾ...
              </div>
            </div>
            <div label="Braille">
              <div className="tab-content-1">
                {braille.toBraille(
                  "Braille Summarized Text Will be Shown Here..."
                )}
              </div>
            </div>
          </Tabs>
        </>
      );
    } else if (isLoaded) {
      if (message === "Success") {
        return (
          <>
            <form onSubmit={this.handleSubmit}>
              <label>Video URL:</label>
              <input
                className="input-1"
                type="url"
                value={this.state.value}
                placeholder="Paste your YouTube Video link here."
                name="name"
                onChange={this.handleChange}
                required
                autoComplete="off"
              />
              <input className="submit-1" type="submit" value="Summarize" />
            </form>
            <p>
              {originalTextLength}
              <i className="arrow right"></i>
              {summarizedTextLength}
            </p>
            <Tabs>
              <div label="English">
                <div className="tab-content">
                  <div>
                    <center>
                      <button
                        className="btn-1"
                        type="button"
                        onClick={this.textToAudio}
                      >
                        Speak
                      </button>
                      <button
                        className="btn-1"
                        type="button"
                        onClick={this.stopAudio}
                      >
                        Stop
                      </button>
                    </center>
                    <center>
                      <a
                        href={ET}
                        className="buttonDownload"
                        download="English_Transcript.txt"
                        type="button"
                      >
                        Download
                      </a>
                    </center>
                  </div>
                  {englishTranscript}
                </div>
              </div>
              <div label="Hindi">
                <div className="tab-content">
                  <div>
                    <center>
                      <a
                        href={HT}
                        className="buttonDownload"
                        download="Hindi_Transcript.txt"
                        type="button"
                      >
                        Download
                      </a>
                    </center>
                  </div>
                  {hindiTranscript}
                </div>
              </div>
              <div label="Punjabi">
                <div className="tab-content">
                  <div>
                    <center>
                      <a
                        href={Punj}
                        className="buttonDownload"
                        download="Punjabi_Transcript.txt"
                        type="button"
                      >
                        Download
                      </a>
                    </center>
                  </div>
                  {punjabiTranscript}
                </div>
              </div>
              <div label="Braille">
                <div className="tab-content">
                  <div>
                    <center>
                      <a
                        href={ET}
                        className="buttonDownload"
                        download="Braille_Transcript.txt"
                        type="button"
                      >
                        Download
                      </a>
                    </center>
                  </div>
                  {brailleText}
                </div>
              </div>
            </Tabs>
          </>
        );
      } else {
        return (
          <>
            <form onSubmit={this.handleSubmit}>
              <label>Video URL:</label>
              <input
                className="input-1"
                type="url"
                value={this.state.value}
                placeholder="Paste your YouTube Video link here."
                name="name"
                onChange={this.handleChange}
                required
                autoComplete="off"
              />
              <input className="submit-1" type="submit" value="Summarize" />
            </form>
            <div>
              <br />
              An Error occured: {this.state.failedMessage}.
            </div>
            <Tabs>
              <div label="English">
                <div className="tab-content-1">
                  English Summarized Text Will be Shown Here...
                </div>
              </div>
              <div label="Hindi">
                <div className="tab-content-1">
                  हिंदी संक्षिप्त पाठ यहाँ दिखाया जाएगा...
                </div>
              </div>
              <div label="Punjabi">
                <div className="tab-content-1">
                  ਪੰਜਾਬੀ ਸੰਖੇਪ ਪਾਠ ਇੱਥੇ ਦਿਖਾਇਆ ਜਾਵੇਗਾ...
                </div>
              </div>
              <div label="Braille">
                <div className="tab-content-1">
                  {braille.toBraille(
                    "Braille Summarized Text Will be Shown Here..."
                  )}
                </div>
              </div>
            </Tabs>
          </>
        );
      }
    } else {
      return (
        <>
          <form onSubmit={this.handleSubmit}>
            <label>Video URL:</label>
            <input
              className="input-1"
              type="url"
              value={this.state.value}
              placeholder="Paste your YouTube Video link here."
              name="name"
              onChange={this.handleChange}
              required
              autoComplete="off"
            />
            <input className="submit-1" type="submit" value="Summarize" />
          </form>
          <p>
            Original Length<i className="arrow right"></i>Summarized Length
          </p>
          <Tabs>
            <div label="English">
              <div className="tab-content-1">
                English Summarized Text Will be Shown Here...
              </div>
            </div>
            <div label="Hindi">
              <div className="tab-content-1">
                हिंदी संक्षिप्त पाठ यहाँ दिखाया जाएगा...
              </div>
            </div>
            <div label="Punjabi">
              <div className="tab-content-1">
                ਪੰਜਾਬੀ ਸੰਖੇਪ ਪਾਠ ਇੱਥੇ ਦਿਖਾਇਆ ਜਾਵੇਗਾ...
              </div>
            </div>
            <div label="Braille">
              <div className="tab-content-1">
                {braille.toBraille(
                  "Braille Summarized Text Will be Shown Here..."
                )}
              </div>
            </div>
          </Tabs>
        </>
      );
    }
  }
}

export default BackendAPI;
