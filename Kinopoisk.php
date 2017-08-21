<?php
namespace bookin\parser;

class Kinopoisk
{

    private function __construct()
    {}

    /**
     * @param $url
     * @return \stdClass
     */
    public static function parseByUrl($url){
        $command = implode(' ', [
            'node',
            'parser.js',
            "'{$url}'",
        ]);
        $exitCode = self::execute($command, null, $output, $output, 55);
        return @json_decode($output, false)?:new \stdClass();
    }

    /**
     * Run command
     * @param $cmd
     * @param null $stdin
     * @param $stdout
     * @param $stderr
     * @param bool $timeout
     * @return int
     */
    protected static function execute($cmd, $stdin=null, &$stdout, &$stderr, $timeout=false){
        $pipes = array();
        $process = proc_open(
            $cmd,
            [['pipe','r'],['pipe','w'],['pipe','w']],
            $pipes
        );
        $start = time();
        $stdout = '';
        $stderr = '';

        if(is_resource($process))
        {
            stream_set_blocking($pipes[0], 0);
            stream_set_blocking($pipes[1], 0);
            stream_set_blocking($pipes[2], 0);
            fwrite($pipes[0], $stdin);
            fclose($pipes[0]);
        }

        while(is_resource($process))
        {
            //echo ".";
            $stdout .= stream_get_contents($pipes[1]);
            $stderr .= stream_get_contents($pipes[2]);

            if($timeout !== false && time() - $start > $timeout)
            {
                proc_terminate($process, 9);
                return 1;
            }

            $status = proc_get_status($process);
            if(!$status['running'])
            {
                fclose($pipes[1]);
                fclose($pipes[2]);
                proc_close($process);
                return $status['exitcode'];
            }

            usleep(100000);
        }

        return 1;
    }
}