import { useState, useEffect, useCallback } from 'react';
import useExternalStyle from "../hooks/useExternalStyle";
import wl1 from '../assets/images/wl1.png';
import wl2 from '../assets/images/wl2.png';
import wl3 from '../assets/images/wl3.png';

const TARGET_DATE = new Date("September 22, 2027 00:00:00").getTime();
const LAUNCH_DATE = new Date("September 22, 2028 00:00:00").getTime();

const INTRO_TEXTS = [
    "Since I was a little girl, my house never felt like a home. It was an exhibition of expectations I could never fulfill.",
    "My parents looked at me not as a child, but as a mirror for their own unaccomplished dreams. Every failure of mine was an unpardonable sin.",
    "I grew up surrounded by a heavy, judgmental silence. But the worst part wasn't the yelling... it was watching my father slowly lose his grip on reality.",
    "He used to stare into blank walls for hours, whispering about a maze inside his own mind. A dark place where he kept his deepest secrets buried.",
    "And then, he just vanished. No note, no tracks, no goodbyes. He disappeared into thin air, leaving us behind with nothing but his broken belongings and an unfinished diary.",
    "My mother blamed me. She said my failures pushed him over the edge, that his mind shattered because he couldn't bear the weight of our reality anymore.",
    "I thought moving to this new city would change things. I genuinely believed that leaving that haunted house behind meant leaving his ghost behind too. How naive.",
    "The rain outside doesn't stop. It washes the streets, but it can't clean the noise inside my head. The city didn't save me; it just gave my isolation a bigger stage.",
    "Every corner here feels like a trap. I keep looking at unfamiliar faces, terrified that I might see his eyes staring back at me from the crowd.",
    "I lock the door behind me, holding his old diary close to my chest, hoping these walls can contain the shattered pieces of my own mind before I catch the same sickness he had.",
    "The darkness here is different. It doesn't bring peace. It brings back his whispers, echoing through the corridors of my thoughts, calling me to enter the very same void that swallowed him.",
    "The shadows on the ceiling look like hands... reaching down from his past, waiting for me to finally slip and follow his footsteps into the deep."
];

export default function Insomnia() {
    useExternalStyle('insomnia.css');

    const [state, setState] = useState(0);
    const [currentLine, setCurrentLine] = useState(0);
    const [displayedText, setDisplayedText] = useState("");
    const [drawnChars, setDrawnChars] = useState(0);
    const [illustrationAlpha, setIllustrationAlpha] = useState(0);
    const [isShake, setIsShake] = useState(false);
    const [fadeAlpha, setFadeAlpha] = useState(0);
    const [countdown, setCountdown] = useState("");
    const [isPasswordScreen, setIsPasswordScreen] = useState(false);
    const [password, setPassword] = useState("");
    const [dots, setDots] = useState("");

    const textSpeed = 0.45;
    useEffect(() => {
        const timer = setInterval(() => {
            const currentTime = Date.now();
            if (currentTime < TARGET_DATE) {
                setCountdown("COMING 2028");
                return;
            }

            const distance = LAUNCH_DATE - currentTime;
            if (distance < 0) {
                setCountdown("LAUNCHING NOW");
                clearInterval(timer);
            } else {
                const days = Math.floor(distance / (1000 * 60 * 60 * 24));
                const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((distance % (1000 * 60)) / 1000);
                setCountdown(`${days}D ${hours}H ${minutes}M ${seconds}S`);
            }
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        const now = new Date().getTime();
        const isReached = now >= TARGET_DATE;
        document.title = isReached ? countdown : "Insomnia - Coming 2028";
        const favicon = document.querySelector("link[rel='icon']");
        if (favicon) favicon.href = isReached ? "/insomnia.ico" : "/insomnia.ico";
    }, [countdown]);

    useEffect(() => {
        if (state === 4) {
            const timer = setTimeout(() => setIsPasswordScreen(true), 2000);
            return () => clearTimeout(timer);
        }
    }, [state]);

    useEffect(() => {
        let interval;
        if (state === 0) {
            interval = setInterval(() => {
                setIllustrationAlpha(prev => {
                    if (prev >= 1) { setState(1); return 1; }
                    return prev + 0.02;
                });
            }, 16);
        } else if (state === 1) {
            interval = setInterval(() => {
                const targetText = INTRO_TEXTS[currentLine];
                if (drawnChars < targetText.length) {
                    setDrawnChars(prev => prev + textSpeed);
                    setDisplayedText(targetText.substring(0, Math.floor(drawnChars)));
                } else {
                    setState(2);
                }
            }, 16);
        }
        return () => clearInterval(interval);
    }, [state, currentLine, drawnChars]);

    const handleInteraction = useCallback((e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'BUTTON' || e.target.tagName === 'A') {
        return;
    }
    const isZKey = e.key && e.key.toLowerCase() === 'z';
    const isClickOrTouch = e.type === 'mousedown' || e.type === 'touchstart';

    if ((isZKey || isClickOrTouch) && state === 2) {
        e.preventDefault();

        if (currentLine < INTRO_TEXTS.length - 1) {
            setCurrentLine(prev => prev + 1);
            setDrawnChars(0);
            setDisplayedText("");
            setIsShake(true);
            setTimeout(() => setIsShake(false), 200);
            setState(1);
        } else {
            setState(3);
        }
    }
}, [state, currentLine]);

    useEffect(() => {
    window.addEventListener('keydown', handleInteraction);
    window.addEventListener('mousedown', handleInteraction);
    window.addEventListener('touchstart', handleInteraction, { passive: false });

    return () => {
        window.removeEventListener('keydown', handleInteraction);
        window.removeEventListener('mousedown', handleInteraction);
        window.removeEventListener('touchstart', handleInteraction);
    };
}, [handleInteraction]);

    useEffect(() => {
        if (state === 3) {
            const t = setInterval(() => {
                setIllustrationAlpha(prev => {
                    if (prev <= 0) { setState(4); return 0; }
                    return prev - 0.02;
                });
            }, 16);
            return () => clearInterval(t);
        }
        if (state === 6) {
            const t = setInterval(() => {
                setFadeAlpha(prev => {
                    if (prev >= 1) { setState(7); return 1; }
                    return prev + 0.03;
                });
            }, 16);
            return () => clearInterval(t);
        }
    }, [state]);

    return (
    <>
        <div class="mobile-banner">
            Access via computer for the best experience.
        </div>
        <div className={`game-container ${isShake ? 'shake' : ''}`}>
            <div className="crt-overlay" />
            <div className="noise" />

            {state <= 3 && (
                <div style={{ opacity: illustrationAlpha }}>
                    <div className="sketch-frame">
                        <div className="sketch-inner-box" />
                        <div style={{ position: 'absolute', bottom: 10, left: 10, fontSize: '10px', color: '#373430', opacity: 0.5 }}>
                            IMG_REF_028
                        </div>
                    </div>
                    <div className="diary-box">
                        <div className="diary-lines" />
                        <div className="diary-text">{displayedText}</div>
                        {state === 2 && <div className="press-z">Press Z &gt;</div>}
                    </div>
                </div>
            )}

            {(state === 4 || state === 8) && (
    <div className={`whisper-overlay ${isShake ? 'pain-effect' : ''}`}>
        {state === 8 ? (
            <h2 className="whisper-text">{dots}</h2>
        ) : (
            <>
                <h2 className="whisper-text">You can make it, ABBY.</h2>
                {isPasswordScreen && (
                    <>
                        <div className="password-box">
                            {[...Array(6)].map((_, i) => (
                                <input
                                    key={i}
                                    id={`digit-${i}`}
                                    type="number"
                                    pattern="\d*"
                                    maxLength="1"
                                    className="digit-input"
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        if (val && i < 5) document.getElementById(`digit-${i + 1}`).focus();
                                        let newPass = password.split('');
                                        newPass[i] = val;
                                        setPassword(newPass.join(''));
                                    }}
                                />
                            ))}
                        </div>
                        {password === "haha nope" && <p style={{ color: 'var(--col-blood-pencil)', marginTop: '20px' }}>haha nope</p>}
                        {password.length === 6 && password !== "haha nope" && (
                            <button className="unlock-btn" onClick={() => {
                                if (password === "220928") {
                                    setState(8);
                                    let count = 0;
                                    const dotInterval = setInterval(() => {
                                        count++;
                                        if (count === 1) setDots(".");
                                        else if (count === 2) setDots("..");
                                        else if (count === 3) setDots("...");
                                        else {
                                            clearInterval(dotInterval);
                                            setState(4);
                                            setDots("");
                                            setPassword("haha nope");
                                            setTimeout(() => setPassword(""), 2000);
                                        }
                                    }, 800);
                                } else if (password === "191108") {
                                    setState(7);
                                } else {
                                    setIsShake(true);
                                    setTimeout(() => {
                                        setIsShake(false);
                                        setPassword("");
                                        document.querySelectorAll('.digit-input').forEach(el => el.value = '');
                                        document.getElementById('digit-0').focus();
                                    }, 500);
                                }
                            }}>UNLOCK</button>
                        )}
                    </>
                )}
            </>
        )}
    </div>
)}

            {state === 7 && (
    <div className="menu-screen" style={{ overflowY: 'auto', padding: '50px 0' }}>
        <h1 className="game-title">INSOMNIA</h1>
        {new Date().getTime() >= TARGET_DATE ? (
            <div className="post-it">SEPTEMBER 22, 2028</div>
        ) : (
            <div className="post-it">COMING 2028</div>
        )}
        <a href="https://somiari.itch.io/insomnia" target="_blank" rel="noreferrer" className="paper-button">
            BETA TESTING PORTAL
        </a>

        <section className="gallery-section">
            <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>ARCHIVE</h2>
            <div className="gallery-grid">
                <img src={wl1} className="gallery-img" alt="Gallery 1" />
                <img src={wl2} className="gallery-img" alt="Gallery 2" />
                <img src={wl3} className="gallery-img" alt="Gallery 3" />
            </div>
        </section>
    </div>
)}

            {fadeAlpha > 0 && <div className="fade-out" style={{ opacity: fadeAlpha }} />}

            <footer className="countdown-footer">
                <p>© 2026 DEADSMILE</p>
                <p style={{ color: 'var(--col-blood-pencil)', marginTop: '5px' }}>
                    {new Date().getTime() >= TARGET_DATE ? (
                        <span>CHAPTER 1 IS WAITING FOR YOU.<br/>{countdown}</span>
                    ) : (
                        <span>COMING 2028</span>
                    )}
                </p>
            </footer>
        </div>
    </>
        
    );
    

}