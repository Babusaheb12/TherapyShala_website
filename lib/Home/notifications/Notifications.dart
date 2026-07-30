import 'package:flutter/material.dart';
import 'package:therapyshala/utils/constants.dart';
import 'package:therapyshala/utils/flutter_font_style.dart';
import 'NotificationsDetailsScreen.dart';

class NotificationScreen extends StatelessWidget {
  NotificationScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        scrolledUnderElevation: 0,
        centerTitle: true,
        automaticallyImplyLeading: false,
        leading: GestureDetector(
          onTap: () => Navigator.pop(context),
          child: const SizedBox(
            width: 44,
            height: 44,
            child: Icon(Icons.arrow_back, color: Colors.black, size: 20),
          ),
        ),
        title: Text(
          Constants.notifications,
          style: FTextStyle.loginHeading(context),
        ),
      ),
      body: ListView(
        padding: EdgeInsets.symmetric(horizontal: 14),
        children: [
          Text("Today", style: FTextStyle.header(context)),

          SizedBox(height: 10),

          NotificationItem(
            icon: "📱",
            title: "Appointment Reminder",
            message:
                "Hi Aaron, just a friendly reminder that your appointment with [Therapist] is tomorrow at 10:30 AM.",
            time: "08:23 AM",
          ),

          NotificationItem(
            icon: "💯",
            title: "Special Offer Alert",
            message:
                "Don't miss out! Enjoy 20% OFF on all spa and wellness services this week.",
            time: "08:23 AM",
          ),

          NotificationItem(
            icon: "✨",
            title: "New Therapist Available",
            message:
                "Our certified wellness therapist has joined the TherapyShala family.",
            time: "08:23 AM",
          ),

          // SizedBox(height: 1),
          Text("Yesterday", style: FTextStyle.header(context)),

          SizedBox(height: 20),

          NotificationItem(
            icon: "🎉",
            title: "Exclusive Event Invitation",
            message:
                "Join our wellness event this Saturday and enjoy complimentary therapy sessions.",
            time: "08:23 AM",
          ),

          NotificationItem(
            icon: "⭐",
            title: "Feedback Request",
            message: "Share your experience with your recent therapy session.",
            time: "08:23 AM",
            showDivider: false,
          ),

          SizedBox(height: 20),
        ],
      ),
    );
  }
}

class NotificationItem extends StatelessWidget {
  final String icon;
  final String title;
  final String message;
  final String time;
  final bool showDivider;

  NotificationItem({
    super.key,
    required this.icon,
    required this.title,
    required this.message,
    required this.time,
    this.showDivider = true,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        GestureDetector(
          behavior: HitTestBehavior.opaque,
          onTap: () {
            Navigator.push(
              context,
              MaterialPageRoute(
                builder: (context) => NotificationDetailsScreen(
                  title: title,
                  message: message,
                  time: time,
                ),
              ),
            );
          },
          child: Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Container(
                width: 40,
                height: 40,
                decoration: BoxDecoration(
                  color: Color(0xffFFEEF1),
                  shape: BoxShape.circle,
                ),
                child: Center(
                  child: Text(icon, style: TextStyle(fontSize: 18)),
                ),
              ),

              SizedBox(width: 18),

              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Expanded(
                          child: Text(
                            title,
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                            style: FTextStyle.tittle(context),
                          ),
                        ),
                        Text(time, style: FTextStyle.tittle(context)),
                      ],
                    ),
                    SizedBox(height: 5),
                    Text(
                      message,
                      maxLines: 3,
                      overflow: TextOverflow.ellipsis,
                      style: FTextStyle.desc(context),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),

        SizedBox(height: 5),

        if (showDivider) Divider(thickness: 1, color: Color(0xffF1F1F1)),

        if (showDivider) SizedBox(height: 10),
      ],
    );
  }
}
