package uk.co.brett.surviving.enums;

import java.util.Collections;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

public enum GameVariant {

    STANDARD("Standard"),
    GREEN_PLANET("Green Planet"),
    BELOW_BEYOND("Below and Beyond"),
    BEYOND_GREEN("Beyond + Green"),
    TITO_GREEN_PLANET("Tito: Green Planet"),
    EVANS_GREEN_PLANET("Evans: Green Planet"),
    VISUAL_COMPONENT("Visual components only");

    private static final Map<String, GameVariant> ENUM_MAP;
    public static final Map<String, GameVariant> CAP_MAP;

    static {
        Map<String, GameVariant> map = new ConcurrentHashMap<>();
        for (GameVariant instance : GameVariant.values()) {
            map.put(instance.getFormatted(), instance);
        }
        ENUM_MAP = Collections.unmodifiableMap(map);
        
        Map<String, GameVariant> capmap = new ConcurrentHashMap<>();
        capmap.put("STANDARD", STANDARD);
        capmap.put("GREEN_PLANET", GREEN_PLANET);
        capmap.put("BELOW_BEYOND", BELOW_BEYOND);
        capmap.put("BEYOND_GREEN", BEYOND_GREEN);
        capmap.put("TITO_GREEN_PLANET", TITO_GREEN_PLANET);
        capmap.put("EVANS_GREEN_PLANET", EVANS_GREEN_PLANET);
        CAP_MAP = Collections.unmodifiableMap(capmap);
    }

    private final String formatted;

    GameVariant(String s) {
        this.formatted = s;
    }

    public String getFormatted() {
        return formatted;
    }
}
