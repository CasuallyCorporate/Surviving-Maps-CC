package uk.co.brett.surviving.about;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import java.text.ParseException;
import org.immutables.value.Value;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

@Value.Immutable
@JsonSerialize
@JsonDeserialize(as = ImmutableAbout.class)
public abstract class About {
    private static final Logger LOGGER = LogManager.getLogger(AboutService.class);

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd MM yyyy")
    public abstract String date(); // TODO: Bad workaround...

    public abstract List<String> items();

    public String formatted() {
        if (date().matches("\\d{2} \\d{2} \\d{4}"))
        {
            Date formdate;
            try{
                formdate = new SimpleDateFormat("dd MM yyyy").parse(date());
            }
            catch (ParseException e)
            {
                return "ERROR?: " + e.getMessage();
            }
            
            return new SimpleDateFormat("dd LLLL yyyy").format(formdate);
        }
        
        return date();
    }
    

}
