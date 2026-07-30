import 'package:flutter/material.dart';
import 'package:therapyshala/utils/constants.dart';
import 'package:therapyshala/utils/flutter_color_themes.dart';
import 'package:therapyshala/utils/flutter_font_style.dart';

class PushNotificationScreen extends StatefulWidget {
  PushNotificationScreen({super.key});

  @override
  State<PushNotificationScreen> createState() =>
      _PushNotificationScreenState();
}

class _PushNotificationScreenState extends State<PushNotificationScreen> {
  bool _specialOffers = true;
  bool _bookingUpdates = true;
  bool _soundVibrate = true;
  bool _appUpdates = false;
  bool _generalNotify = true;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        leading: Center(
          child: GestureDetector(
            onTap: () => Navigator.pop(context),
            child: Icon(
              Icons.arrow_back,
              color: Colors.black,
              size: 18,
            ),
          ),
        ),
        title: Text(
          Constants.pushNotification,
          style: FTextStyle.header(context),
        ),
        centerTitle: true,
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: EdgeInsets.symmetric(horizontal: 20, vertical: 16),
          child: Column(
            children: [
              _buildSwitchTile(
                title: Constants.spacialOffer,
                subtitle: Constants.profileDiscountSpa,
                value: _specialOffers,
                onChanged: (val) => setState(() => _specialOffers = val),
              ),
              Divider(color: Color(0xFFF0F0F3), height: 1),
              _buildSwitchTile(
                title: Constants.bookingUpdates,
                subtitle: Constants.realTimeNotifications,
                value: _bookingUpdates,
                onChanged: (val) => setState(() => _bookingUpdates = val),
              ),
              Divider(color: Color(0xFFF0F0F3), height: 1),
              _buildSwitchTile(
                title: Constants.soundVibrate,
                subtitle: Constants.playSoundAndVibrateForIncomingNotifications,
                value: _soundVibrate,
                onChanged: (val) => setState(() => _soundVibrate = val),
              ),
              Divider(color: Color(0xFFF0F0F3), height: 1),
              _buildSwitchTile(
                title: Constants.appUpdates,
                subtitle: Constants.getNotifiedWhenAnewFeatureOrAppUpdateArrives,
                value: _appUpdates,
                onChanged: (val) => setState(() => _appUpdates = val),
              ),
              Divider(color: Color(0xFFF0F0F3), height: 1),
              _buildSwitchTile(
                title: Constants.generalNotify,
                subtitle: Constants.tipsWellnessGuides,
                value: _generalNotify,
                onChanged: (val) => setState(() => _generalNotify = val),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildSwitchTile({
    required String title,
    required String subtitle,
    required bool value,
    required ValueChanged<bool> onChanged,
  }) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 10),
      child: Row(
        children: [
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: FTextStyle.tittle(context),
                ),
                const SizedBox(height: 4),
                Text(
                  subtitle,
                  style: FTextStyle.desc(context),
                ),
              ],
            ),
          ),

          Container(
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(10),
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withOpacity(0.08),
                  blurRadius: 8,
                  offset:  Offset(0, 2),
                ),
              ],
            ),
            child: Switch(
              value: value,
              onChanged: onChanged,
              materialTapTargetSize: MaterialTapTargetSize.shrinkWrap,

              activeColor: Colors.white,
              activeTrackColor: AppColors.primary,

              inactiveThumbColor: Colors.white,
              inactiveTrackColor: const Color(0xFFE5E7EB),

              trackOutlineColor: WidgetStateProperty.all(
                Colors.transparent,
              ),
            ),
          ),
        ],
      ),
    );
  }
}
