import AppKit
import Foundation

func argValue(_ name: String) -> String? {
    let args = CommandLine.arguments
    guard let index = args.firstIndex(of: name), index + 1 < args.count else { return nil }
    return args[index + 1]
}

final class NotificationDelegate: NSObject, NSUserNotificationCenterDelegate {
    func userNotificationCenter(
        _ center: NSUserNotificationCenter,
        shouldPresent notification: NSUserNotification
    ) -> Bool {
        return true
    }
}

let title = String((argValue("--title") ?? "Forge").prefix(120))
let body = String((argValue("--body") ?? "").prefix(1000))
let sound = argValue("--sound")

let delegate = NotificationDelegate()
let center = NSUserNotificationCenter.default
center.delegate = delegate

let notification = NSUserNotification()
notification.title = title
notification.informativeText = body
notification.soundName = sound?.isEmpty == false ? sound : NSUserNotificationDefaultSoundName
notification.hasActionButton = false

center.deliver(notification)
RunLoop.current.run(until: Date(timeIntervalSinceNow: 1.0))
