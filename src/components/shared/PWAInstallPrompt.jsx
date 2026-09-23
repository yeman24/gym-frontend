import { useState, useEffect } from "react";
import { Download, Smartphone, Share, PlusSquare, WifiOff, X } from "lucide-react";
import { usePWA } from "../../hooks/usePWA";

export function PWAInstallPrompt() {
  const { isInstallable, isStandalone, isOnline, isIOS, promptInstall } = usePWA();
  const [dismissed, setDismissed] = useState(false);
  const [showIosGuide, setShowIosGuide] = useState(false);

  useEffect(() => {
    const isDismissed = sessionStorage.getItem("ironhouse-pwa-dismissed") === "true";
    if (isDismissed) {
      setDismissed(true);
    }
  }, []);

  const handleDismiss = () => {
    setDismissed(true);
    sessionStorage.setItem("ironhouse-pwa-dismissed", "true");
  };

  const handleInstallClick = async () => {
    if (isIOS) {
      setShowIosGuide(!showIosGuide);
      return;
    }
    await promptInstall();
  };

  const canShowPrompt = !isStandalone && !dismissed && (isInstallable || isIOS);

  return (
    <>
      {/* Offline Alert Strip */}
      {!isOnline && (
        <div className="pwa-offline-banner" role="status">
          <WifiOff size={16} />
          <span>You are currently offline. Showing cached gym info and schedules.</span>
        </div>
      )}

      {/* PWA Install Banner */}
      {canShowPrompt && (
        <div className="pwa-install-banner">
          <div className="pwa-install-content">
            <div className="pwa-badge-icon">
              <Smartphone size={22} />
            </div>
            <div className="pwa-copy">
              <strong>Install IronHouse App</strong>
              <p>Add to your home screen for faster access, class schedules & offline view.</p>
            </div>
          </div>

          <div className="pwa-actions">
            {isIOS ? (
              <button
                className="btn btn-primary pwa-btn"
                onClick={() => setShowIosGuide(!showIosGuide)}
              >
                <Share size={15} />
                <span>How to Install</span>
              </button>
            ) : (
              <button className="btn btn-primary pwa-btn" onClick={handleInstallClick}>
                <Download size={15} />
                <span>Install</span>
              </button>
            )}
            <button
              className="pwa-close-btn"
              onClick={handleDismiss}
              aria-label="Dismiss install banner"
            >
              <X size={18} />
            </button>
          </div>

          {/* iOS Safari Instructions Accordion/Drawer */}
          {showIosGuide && (
            <div className="pwa-ios-instructions">
              <p className="pwa-ios-step">
                <strong>1.</strong> Tap the <strong>Share</strong> button <Share size={14} className="inline-icon" /> at the bottom of Safari.
              </p>
              <p className="pwa-ios-step">
                <strong>2.</strong> Scroll down and select <strong>Add to Home Screen</strong> <PlusSquare size={14} className="inline-icon" />.
              </p>
              <p className="pwa-ios-step">
                <strong>3.</strong> Tap <strong>Add</strong> in the top right corner.
              </p>
            </div>
          )}
        </div>
      )}
    </>
  );
}

/**
 * Header / Navbar install button that can be embedded anywhere
 */
export function PWAHeaderButton() {
  const { isInstallable, isStandalone, isIOS, promptInstall } = usePWA();
  const [showIosModal, setShowIosModal] = useState(false);

  if (isStandalone || (!isInstallable && !isIOS)) {
    return null;
  }

  const handleClick = () => {
    if (isIOS) {
      setShowIosModal(true);
    } else {
      promptInstall();
    }
  };

  return (
    <>
      <button
        onClick={handleClick}
        className="pwa-nav-btn"
        title="Install IronHouse App"
        aria-label="Install App"
      >
        <Download size={14} />
        <span>Get App</span>
      </button>

      {showIosModal && (
        <div className="pwa-modal-backdrop" onClick={() => setShowIosModal(false)}>
          <div className="pwa-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="pwa-modal-header">
              <span className="eyebrow">Progressive Web App</span>
              <h3>Install on iPhone / iPad</h3>
            </div>
            <ol className="pwa-modal-steps">
              <li>Tap the <strong>Share</strong> icon <Share size={15} className="inline-icon" /> at the bottom of Safari.</li>
              <li>Scroll down and tap <strong>Add to Home Screen</strong> <PlusSquare size={15} className="inline-icon" />.</li>
              <li>Tap <strong>Add</strong> to launch IronHouse from your Home Screen.</li>
            </ol>
            <button className="btn btn-primary" onClick={() => setShowIosModal(false)}>
              Got it
            </button>
          </div>
        </div>
      )}
    </>
  );
}
