import 'package:flutter/material.dart';
import 'package:therapyshala/utils/constants.dart';
import 'package:therapyshala/utils/flutter_color_themes.dart';
import 'package:therapyshala/utils/flutter_font_style.dart';

class AccessibilityScreen extends StatefulWidget {
  AccessibilityScreen({super.key});

  @override
  State<AccessibilityScreen> createState() => _AccessibilityScreenState();
}

class _AccessibilityScreenState extends State<AccessibilityScreen> {
  bool _largeText = false;
  bool _highContrast = false;
  bool _screenReader = false;
  bool _reduceMotion = false;

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
          Constants.accessibility,
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
                title: Constants.largeTextMode,
                subtitle: Constants.increaseFontSizeThroughoutTheAppForBetterReadability,
                value: _largeText,
                onChanged: (val) => setState(() => _largeText = val),
              ),
              Divider(color: Color(0xFFF0F0F3), height: 16),
              _buildSwitchTile(
                title: Constants.highContrastMode,
                subtitle: Constants.enhanceTextContrastAndUiElementVisibility,
                value: _highContrast,
                onChanged: (val) => setState(() => _highContrast = val),
              ),
              Divider(color: Color(0xFFF0F0F3), height: 16),
              _buildSwitchTile(
                title: Constants.screenReaderSupport,
                subtitle: Constants.optimizeUiLabelsAndHintsForTalkBackVoiceOver,
                value: _screenReader,
                onChanged: (val) => setState(() => _screenReader = val),
              ),
              Divider(color: Color(0xFFF0F0F3), height: 16),
              _buildSwitchTile(
                title: Constants.reduceMotion,
                subtitle: Constants.minimizeScreenTransitionAnimationsAndUiEffects,
                value: _reduceMotion,
                onChanged: (val) => setState(() => _reduceMotion = val),
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
      padding: EdgeInsets.symmetric(vertical: 8),
      child: Row(
        children: [
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: FTextStyle.tittle(context)
                ),
                SizedBox(height: 4),
                Text(
                  subtitle,
                  style: FTextStyle.desc(context)
                ),
              ],
            ),
          ),
          Switch.adaptive(
            value: value,
            activeColor: AppColors.primary,
            onChanged: onChanged,
          ),
        ],
      ),
    );
  }
}
