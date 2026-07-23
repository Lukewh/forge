import Cocoa
import Foundation

struct Overview: Decodable {
    struct Issue: Decodable {
        let state: String
        let pr_approved_at: String?
    }

    struct Scheduler: Decodable {
        let running: Int?
    }

    let issues: [Issue]
    let decisions: [Decision]
    let runningAgents: [AgentRun]
    let scheduler: Scheduler?
}

struct Decision: Decodable {}
struct AgentRun: Decodable {}

final class ForgeStatusBar: NSObject, NSApplicationDelegate {
    private var statusItem: NSStatusItem!
    private var statusMenuItem: NSMenuItem!
    private var timer: Timer?
    private let port: String

    override init() {
        let env = ProcessInfo.processInfo.environment
        self.port = env["FORGE_DESKTOP_PORT"] ?? env["PORT"] ?? "3142"
        super.init()
    }

    func applicationDidFinishLaunching(_ notification: Notification) {
        NSApp.setActivationPolicy(.accessory)

        statusItem = NSStatusBar.system.statusItem(withLength: NSStatusItem.variableLength)
        statusItem.button?.title = "⚒"
        statusItem.button?.toolTip = "Forge"

        let menu = NSMenu()
        statusMenuItem = NSMenuItem(title: "Forge starting…", action: nil, keyEquivalent: "")
        statusMenuItem.isEnabled = false
        menu.addItem(statusMenuItem)
        menu.addItem(NSMenuItem.separator())
        menu.addItem(NSMenuItem(title: "Open Forge", action: #selector(openForge), keyEquivalent: "o"))
        menu.addItem(NSMenuItem(title: "Refresh", action: #selector(refreshNow), keyEquivalent: "r"))
        menu.addItem(NSMenuItem.separator())
        menu.addItem(NSMenuItem(title: "Quit Status Item", action: #selector(quit), keyEquivalent: "q"))
        statusItem.menu = menu

        refreshNow()
        timer = Timer.scheduledTimer(withTimeInterval: 15, repeats: true) { [weak self] _ in
            self?.refreshNow()
        }
    }

    @objc private func openForge() {
        if let url = URL(string: "http://localhost:\(port)") {
            NSWorkspace.shared.open(url)
        }
    }

    @objc private func quit() {
        NSApp.terminate(nil)
    }

    @objc private func refreshNow() {
        guard let url = URL(string: "http://127.0.0.1:\(port)/api/overview") else { return }
        URLSession.shared.dataTask(with: url) { [weak self] data, _, error in
            guard let self else { return }
            if let error {
                DispatchQueue.main.async { self.applyOffline(error.localizedDescription) }
                return
            }
            guard let data else {
                DispatchQueue.main.async { self.applyOffline("No dashboard response") }
                return
            }
            do {
                let overview = try JSONDecoder().decode(Overview.self, from: data)
                DispatchQueue.main.async { self.applyOverview(overview) }
            } catch {
                DispatchQueue.main.async { self.applyOffline("Could not parse dashboard response") }
            }
        }.resume()
    }

    private func applyOffline(_ reason: String) {
        statusItem.button?.title = "⚒ •"
        statusItem.button?.toolTip = "Forge dashboard offline: \(reason)"
        statusMenuItem.title = "Dashboard offline"
    }

    private func applyOverview(_ overview: Overview) {
        let needs = overview.decisions.count
        let failed = overview.issues.filter { $0.state == "FAILED" }.count
        let approved = overview.issues.filter { issue in
            issue.pr_approved_at != nil && !["DONE", "PAUSED", "IGNORED", "FAILED"].contains(issue.state)
        }.count
        let running = overview.runningAgents.count

        if needs > 0 {
            statusItem.button?.title = "⚒ \(needs)"
        } else if failed > 0 {
            statusItem.button?.title = "⚒ !"
        } else if approved > 0 {
            statusItem.button?.title = "⚒ ✓"
        } else if running > 0 {
            statusItem.button?.title = "⚒ …"
        } else {
            statusItem.button?.title = "⚒"
        }

        let parts = [
            needs == 1 ? "1 needs you" : "\(needs) need you",
            failed == 1 ? "1 failed" : "\(failed) failed",
            approved == 1 ? "1 approved PR" : "\(approved) approved PRs",
            running == 1 ? "1 running" : "\(running) running"
        ]
        let summary = parts.joined(separator: " · ")
        statusItem.button?.toolTip = "Forge — \(summary)"
        statusMenuItem.title = summary
    }
}

let app = NSApplication.shared
let delegate = ForgeStatusBar()
app.delegate = delegate
app.run()
