package uk.co.brett.surviving.about;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.type.CollectionType;
import com.fasterxml.jackson.datatype.guava.GuavaModule;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import java.io.IOException;
import java.io.InputStream;
import java.util.Comparator;
import java.util.List;


@Service
public class AboutService {
    private static final Logger LOGGER = LogManager.getLogger(AboutService.class);

    private static final String NEWFILE = "/NewChangeLog.json";
    private static final String OLDFILE = "/OriginalChangeLog.json";

    private List<About> _newAboutHistory;
    private List<About> _oldAboutHistory;

    @PostConstruct
    public void parse() {
        try {
            InputStream fis = getInputStream(false);
            ObjectMapper mapper = new ObjectMapper().registerModule(new GuavaModule());
            CollectionType t = mapper.getTypeFactory().constructCollectionType(List.class, About.class);

            readStream(fis, mapper, t, false);
        } catch (IOException e) {
            LOGGER.error(e);
        }
        
        try {
            InputStream fis = getInputStream(true);
            ObjectMapper mapper = new ObjectMapper().registerModule(new GuavaModule());
            CollectionType t = mapper.getTypeFactory().constructCollectionType(List.class, About.class);

            readStream(fis, mapper, t, true);
        } catch (IOException e) {
            LOGGER.error(e);
        }
    }

    void readStream(InputStream fis, ObjectMapper mapper, CollectionType t, boolean newest) throws IOException {
        if (newest) {
            _newAboutHistory = mapper.readValue(fis, t);
            Comparator<About> comp = Comparator.comparing(About::date).reversed();
            _newAboutHistory = _newAboutHistory.stream().sorted(comp).toList();
        }
        else
        {
            _oldAboutHistory = mapper.readValue(fis, t);
            Comparator<About> comp = Comparator.comparing(About::date).reversed();
            _oldAboutHistory = _oldAboutHistory.stream().sorted(comp).toList();
        }
    }

    InputStream getInputStream(boolean newest) throws IOException {
        if (newest)
        {
            return AboutService.class.getResource(NEWFILE).openStream();
        }
        else
        {
            return AboutService.class.getResource(OLDFILE).openStream();
        }
    }

    public List<About> getAboutHistory(boolean newest) {
        if (newest)
        {
            return _newAboutHistory;
        }
        else
        {
            return _oldAboutHistory;
        }
    }
}
